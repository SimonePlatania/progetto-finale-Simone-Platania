package com.asta.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
import com.notifica.service.NotificaService;

@Service
public class AstaService {

	private final AstaMapper astaMapper;
	private final ItemMapper itemMapper;
	private final OffertaMapper offertaMapper;
	private final UtenteMapper utenteMapper;
	private final NotificaService notificaService;
	LocalDateTime now = LocalDateTime.now();

	public AstaService(AstaMapper astaMapper, ItemMapper itemMapper, OffertaMapper offertaMapper,
			UtenteMapper utenteMapper, NotificaService notificaService) {
		this.astaMapper = astaMapper;
		this.itemMapper = itemMapper;
		this.offertaMapper = offertaMapper;
		this.utenteMapper = utenteMapper;
		this.notificaService = notificaService;
	}

	public List<Asta> getAsteAttive() {
	    LocalDateTime now = LocalDateTime.now();
	    List<Asta> asteAttive = astaMapper.findAsteAttive();

	    for (Asta asta : asteAttive) {
	    	
	        if (!asta.isStartNow() && asta.getDataInizio().isBefore(now)) {
	            asta.setStartNow(true);
	            astaMapper.updateStartNow(asta); 
	        }

	        if (asta.getOffertaCorrenteId() != null) {
	            Utente offerente = utenteMapper.findById(asta.getOffertaCorrenteId());
	            if (offerente != null) {
	                asta.setUsernameOfferente(offerente.getUsername());
	            }
	        }
	    }

	    return asteAttive;
	}

	public Asta findById(Long id) {
		return astaMapper.findById(id);
	}

	//// 28/12/2024 Simone CREAZIONE ASTA 1)
	@Transactional
	public Asta createAsta(CreaAstaRequest request, Long gestoreId) {
		LocalDateTime now = LocalDateTime.now();
		System.out.println("Request ricevuta: " + request.getItemId());

		// 06/01 Simone Avuti problemi durante la creazione dell'asta
		if (request.isStartNow()) {
			request.setDataInizio(now);
		}

		validateDates(request, now);
		validateAstaRequest(request);

		// Validazione e controllo dell'item
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

		List<Utente> partecipanti = utenteMapper.findAllByRuolo("PARTECIPANTE");

		for (Utente partecipante : partecipanti) {
			notificaService.inviaNotificaNuovaAsta(asta.getId(), partecipante.getId(), asta.getNomeItem()

			);
		}

		return asta;
	}

	private void validateDates(CreaAstaRequest request, LocalDateTime now) {
		if (request.getDataFine() == null) {
			throw new RuntimeException("La data di fine è obbligatoria");
		}

		LocalDateTime startReference = request.isStartNow() ? now : request.getDataInizio();

		if (!request.isStartNow() && (request.getDataInizio() == null || request.getDataInizio().isBefore(now))) {
			throw new RuntimeException(
					"La data di inizio non può essere nel passato o nulla quando non vuoi startare immeditamente l'asta");
		}

		if (request.getDataFine().isBefore(startReference)) {
			throw new RuntimeException("La data di fine deve essere successiva alla data di inizio");
		}

		long durataMinuti = java.time.temporal.ChronoUnit.MINUTES.between(startReference, request.getDataFine());
		if (durataMinuti < 5) {
			throw new RuntimeException("L'asta deve durare almeno 5 minuti");
		}
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

		if (request.getDataFine().isBefore(request.getDataInizio())) {
			throw new IllegalArgumentException("La data di fine non può essere precedente a quella d'inizio");

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
		LocalDateTime now = LocalDateTime.now();
		Asta asta = astaMapper.findById(astaId);

		if (asta == null || !asta.getIsAttiva()) {
			throw new RuntimeException("Asta non trovata o non attiva");
		}

		if (asta.getDataFine().isBefore(now)) {
			throw new RuntimeException("Asta terminata");
		}

		if (userId.equals(asta.getOffertaCorrenteId())) {
			throw new RuntimeException("Non puoi fare un'offerta se sei già l'ultimo offertente");
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

		if (asta.getOffertaCorrenteId() != null) {
			notificaService.inviaNotificaOffertaSuperata(astaId, asta.getOffertaCorrenteId(), importoOfferta);
		}

	    LocalDateTime nuovaDataFine = now.plusMinutes(5);
	    asta.setDataFine(nuovaDataFine);
	    astaMapper.updateDataFine(asta);

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

		String usernameOfferente = utenteMapper.findById(userId).getUsername();
		notificaService.inviaNotificaPartecipazione(astaId, userId, item.getGestoreId(), usernameOfferente);

		List<Long> partecipanti = astaMapper.findPartecipantiByAstaId(astaId);
		for (Long partecipanteId : partecipanti) {
			if (!partecipanteId.equals(userId)) {
				notificaService.inviaNotificaOfferta(astaId, partecipanteId, importoOfferta);
			}
		}

		if (asta.getDataFine().minusMinutes(5).isBefore(now)) {
			for (Long partecipanteId : partecipanti) {
				notificaService.inviaNotificaScadenza(astaId, partecipanteId);
			}
		}
	}

	public List<OffertaDTO> getStoricoOfferte(Long astaId, Long userId) {
		Utente utente = utenteMapper.findById(userId);
		boolean isGestore = "GESTORE".equals(utente.getRuolo());

		System.out.println(
				"Recupero offerte per asta: " + astaId + ", utente: " + userId + " (isGestore: " + isGestore + ")");

		List<Offerta> offerte = offertaMapper.findByAstaId(astaId);
		List<OffertaDTO> risultato = new ArrayList<>();

		for (Offerta offerta : offerte) {
			OffertaDTO dto = OffertaDTO.fromOfferta(offerta, isGestore, userId);
			System.out.println("Offerta ID: " + offerta.getId() + ", UtenteId: " + offerta.getUtenteId()
					+ ", isCurrentUser: " + dto.getCurrentUserOfferta());
			risultato.add(dto);
		}

		return risultato;
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
		
		if (asta.getOffertaCorrenteId() != null) {
	        Utente vincitore = utenteMapper.findById(asta.getOffertaCorrenteId());
	        if (vincitore != null) {
	            asta.setUsernameOfferente(vincitore.getUsername());
				notificaService.inviaNotificaVincitore(astaId, asta.getOffertaCorrenteId(), asta.getOffertaCorrente());

	        }
	    }

		asta.setIsAttiva(false);
		asta.setStato("TERMINATA");
		astaMapper.update(asta);

		// 07/01 Simone Qui avevo la necessità di notificare tutti i partecipanti della
		// chiusura dell'asta
		List<Long> partecipanti = astaMapper.findPartecipantiByAstaId(astaId);
		String motivoTerminazione = gestoreId != null ? "Terminata dal gestore" : "Asta conclusa per tempo scaduto";

		for (Long partecipanteId : partecipanti) {
			if (!partecipanteId.equals(asta.getOffertaCorrenteId())) {
				notificaService.inviaNotificaTerminazioneAsta(astaId, partecipanteId, motivoTerminazione);
			}
		}

		Item item = itemMapper.findById(asta.getItemId());
		item.setInAsta(false);
		if (asta.getOffertaCorrenteId() != null) {
			item.setDeleted(true);
		}
		itemMapper.update(item);
	}

	// 28/12/2024 Simone SERVICE PER IL CONTROLLO DELLE ASTE SCADUTE 5)
	@Transactional
	public void checkAsteScadute() {
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
		
		Utente utente = utenteMapper.findById(userId);
		if (utente == null) {
			throw new RuntimeException("Utente non trovato" +userId);
		}
		return astaMapper.findAsteVinte(userId);
	}

	public List<Asta> getAstePartecipate(Long userId) {
		return astaMapper.findAstePartecipate(userId);
	}

}
