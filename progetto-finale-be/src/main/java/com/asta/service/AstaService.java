package com.asta.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.asta.dto.CreaAstaRequest;
import com.asta.dto.OffertaDTO;
import com.asta.entity.Asta;
import com.asta.entity.Offerta;
import com.asta.mapper.AstaMapper;
import com.asta.mapper.OffertaMapper;
import com.item.entity.Item;
import com.item.mapper.ItemMapper;
import com.login.entity.Utente;
import com.login.mapper.UtenteMapper;

@Service
public class AstaService {

	private final AstaMapper astaMapper;
	private final ItemMapper itemMapper;
	private final OffertaMapper offertaMapper;
	private final UtenteMapper utenteMapper;
	LocalDateTime now = LocalDateTime.now();

	public List<Asta> getAsteAttive() {
	    List<Asta> asteAttive = astaMapper.findAsteAttive();

	    for (Asta asta : asteAttive) {
	        if (asta.getOffertaCorrenteId() != null) {
	            Utente offerente = utenteMapper.findById(asta.getOffertaCorrenteId());
	            if (offerente != null) {
	                asta.setUsernameOfferente(offerente.getUsername());
	            }
	        }
	    }

	    return asteAttive;
	}

	public AstaService(AstaMapper astaMapper, ItemMapper itemMapper, OffertaMapper offertaMapper,
			UtenteMapper utenteMapper) {
		this.astaMapper = astaMapper;
		this.itemMapper = itemMapper;
		this.offertaMapper = offertaMapper;
		this.utenteMapper = utenteMapper;
	}

	public Asta findById(Long id) {
		return astaMapper.findById(id);
	}

	//// 28/12/2024 Simone CREAZIONE ASTA 1)
	@Transactional
	public Asta createAsta(CreaAstaRequest request, Long gestoreId) {
		System.out.println("Request ricevuta: " + request.getItemId());

		validateAstaRequest(request);

		Item item = itemMapper.findById(request.getItemId());
		System.out.println("Item trovato: " + item);
		if (item == null) {
			throw new RuntimeException("Item non trovato");
		}

		System.out.println("Prezzo base: " + item.getPrezzoBase());

		if (item.getInAsta()) {
			throw new RuntimeException("Item già in asta");
		}

		if (!item.getGestoreId().equals(gestoreId)) {
			throw new RuntimeException("Non sei autorizzato a mettere questo item nell'asta");
		}

		if (item.getPrezzoBase() == null) {
			throw new RuntimeException("L'item deve avere un prezzo base");
		}

		if (request.isStartNow()) {
			request.setDataInizio(now);

		}

		Asta asta = new Asta();
		asta.setItemId(request.getItemId());
		asta.setDataInizio(request.getDataInizio());
		asta.setDataFine(request.getDataFine());
		asta.setStato("CREATA");
		asta.setIsAttiva(true);
		asta.setNomeItem(item.getNome());
		asta.setStartNow(request.isStartNow());

		astaMapper.insert(asta);
		item.setInAsta(true);
		itemMapper.update(item);

		return asta;

	}

	// 28/12/2024 Simone TUTTE LE VALIDAZIONI NECESSARIE 2)
	private void validateAstaRequest(CreaAstaRequest request) {
		if (!request.isStartNow() && request.getDataInizio() == null) {
			throw new IllegalArgumentException(
					"Data di inizio deve essere specificata se l'asta non inizia immediatamente");
		}

		if (request.getDataFine() == null) {
			throw new IllegalArgumentException("Data di fine deve essere specificata");
		}

		if (!request.isStartNow() && request.getDataInizio().isBefore(now)) {
			throw new IllegalArgumentException("La data di inizio deve essere futura");
		}

		if (request.getDataFine().isBefore(now.plusMinutes(5))) {
			throw new IllegalArgumentException("L'asta deve durare almeno 5 minuti");
		}
	}

	//// 28/12/2024 Simone SERVICE UTILIZZATO PER POTER FARE UN OFFERTA 3)
	@Transactional
	public void faiOfferta(Long astaId, Long userId, BigDecimal importoOfferta) {
		Asta asta = astaMapper.findById(astaId);

		if (asta == null || !asta.getIsAttiva()) {
			throw new RuntimeException("Asta non trovata o non attiva");
		}

		if (asta.getDataFine().isBefore(now)) {
			throw new RuntimeException("Asta terminata");
		}

		Item item = itemMapper.findById(asta.getItemId());
		if (asta.getOffertaCorrente() == null) {
			if (importoOfferta.compareTo(item.getPrezzoBase()) < 0) {
				throw new RuntimeException("L'offerta deve essere maggiore o uguale al prezzo base");
			}
		} else {

			BigDecimal offertaMinima = asta.getOffertaCorrente().add(item.getRilancioMinimo());
			if (importoOfferta.compareTo(offertaMinima) < 0) {
				throw new RuntimeException("L'offerta deve superare l'offerta corrente di almeno il rilancio minimo");
			}

		}

		Offerta offerta = new Offerta();
		offerta.setAstaId(astaId);
		offerta.setItemId(asta.getItemId());
		offerta.setUtenteId(userId);
		offerta.setImporto(importoOfferta);
		offerta.setDataOfferta(LocalDateTime.now());

		offertaMapper.insert(offerta);

		asta.setOffertaCorrente(importoOfferta);
		asta.setOffertaCorrenteId(userId);
		astaMapper.updateOfferta(asta);
	}

	public List<OffertaDTO> getStoricoOfferte(Long astaId, Long userId) {
		Utente utente = utenteMapper.findById(userId);
		boolean isGestore = "GESTORE".equals(utente.getRuolo());

		List<Offerta> offerte = offertaMapper.findByAstaId(astaId);

		return offerte.stream().map(offerta -> OffertaDTO.fromOfferta(offerta, isGestore)).collect(Collectors.toList());
	}

	// 28/12/2024 Simone SERVICE PER POTER TERMINARE UN'ASTA 4)
	@Transactional
	public void terminaAsta(Long astaId, Long gestoreId) {
		Asta asta = astaMapper.findById(astaId);

		if (asta == null) {
			throw new RuntimeException("Asta non trovata");
		}

		if (gestoreId != null) {

			Item item = itemMapper.findById(asta.getItemId());
			if (!item.getGestoreId().equals(gestoreId)) {
				throw new RuntimeException("Non sei autorizzato a terminare questa asta");
			}
		}

		asta.setIsAttiva(false);
		asta.setStato("TERMINATA");
		astaMapper.update(asta);

		Item item = itemMapper.findById(asta.getItemId());
		item.setInAsta(false);
		itemMapper.update(item);
	}

	// 28/12/2024 Simone SERVICE PER IL CONTROLLO DELLE ASTE SCADUTE 5)
	@Transactional
	public void checkAsteScadute() {
		// Aggiungiamo log per debug
		LocalDateTime now = LocalDateTime.now();
		System.out.println("Checking aste scadute at: " + now);

		List<Asta> asteScadute = astaMapper.findAsteScadute();
		System.out.println("Trovate " + asteScadute.size() + " aste scadute");

		for (Asta asta : asteScadute) {
			System.out.println("Terminando asta: " + asta.getId() + " con data fine: " + asta.getDataFine());
			terminaAsta(asta.getId(), null);
		}
	}

	// 28/12/2024 Simone SERVICE PER RITROVARE LE ASTE CHE SONO STATE VINTE 6)
	public List<Asta> getAsteVinte(Long userId) {
		return astaMapper.findAsteVinte(userId);
	}

}
