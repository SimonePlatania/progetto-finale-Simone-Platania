package com.notifica.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.notifica.entity.Notifica;
import com.notifica.mapper.NotificaMapper;

@Service
@Transactional
public class NotificaService {
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificaMapper notificaMapper;

	public NotificaService(SimpMessagingTemplate messagingTemplate, NotificaMapper notificaMapper) {
		this.messagingTemplate = messagingTemplate;
		this.notificaMapper = notificaMapper;
	}

	public void inviaNotificaOfferta(Long astaId, Long receiverId, BigDecimal importo) {
		if (astaId == null || receiverId == null || importo == null) {
			throw new IllegalArgumentException("Parameters cannot be null");
		}
		
		//FINITO

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_NUOVA_OFFERTA);
		notifica.setMessaggio("Nuova offerta di €" + importo + " per l'asta #" + astaId);
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(receiverId);
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(receiverId.toString(), "/notifica/utente", notifica);
			System.out.println("Notifica offerta inviata a: " + receiverId);
		} catch (Exception e) {
			System.err.println("Errore invio notifica offerta: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void inviaNotificaNuovaAsta(Long astaId, Long receiverId, String nomeItem) {
		if (astaId == null || receiverId == null || nomeItem == null) {
			throw new IllegalArgumentException("I parametri non possono essere null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_NUOVA_ASTA);
		notifica.setMessaggio("Una nuova asta è stata creata: " + nomeItem);
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(receiverId);
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(receiverId.toString(), "/notifica/utente", notifica);
			System.out.println("Notifica offerta inviata a: " + receiverId);

		} catch (Exception e) {
			System.out.println("Errore invio notifica nuova asta: " + e.getMessage());
			e.printStackTrace();
		}

	}

	public void inviaNotificaScadenza(Long astaId, Long userId) {
		if (astaId == null || userId == null) {
			throw new IllegalArgumentException("I parametri non possono essere null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo("ASTA_SCADUTA");
		notifica.setMessaggio("L'asta #" + astaId + " sta per scadere!");
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(userId);
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(userId.toString(), "/notifica/utente", notifica);
		} catch (Exception e) {
			System.err.println("Errore invio notifica scadenza: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void inviaNotificaPartecipazione(Long astaId, Long receiverId, Long gestoreId, String usernamePartecipante) {
		if (astaId == null || receiverId == null || gestoreId == null) {
			throw new IllegalArgumentException("Parameters cannot be null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_PARTECIPAZIONE_ASTA);
		notifica.setMessaggio("Nuova offerta da: " + usernamePartecipante + ", ID asta #"+astaId);
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(gestoreId);
		notifica.setTipoUtente("GESTORE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(gestoreId.toString(), "/notifica/utente", notifica);
			System.out.println("Notifica partecipazione inviata al gestore: " + gestoreId);
		} catch (Exception e) {
			System.err.println("Errore invio notifica partecipazione: " + e.getMessage());
			e.printStackTrace();
		}
	}
	

	public List<Notifica> getNotificheUtente(Long userId) {
		return notificaMapper.findByUserId(userId);
	}

	public void markAsRead(Long id) {
		notificaMapper.markAsRead(id);
	}
	
	@Transactional
	public List<Notifica> markAllAsRead(Long userId) {
		if (userId == null) {
			throw new IllegalArgumentException("UserId e Id non possono essere null");
			
		}
		
		try {
			notificaMapper.markAllAsRead(userId);
		List<Notifica> notificheAggiornate = notificaMapper.findByUserId(userId);
		
		return notificheAggiornate != null ? notificheAggiornate : new ArrayList<>();
		
		} catch (Exception e) {
			
			throw new RuntimeException("Errore durante l'aggiornamento delle modifiche");
		}

	}

	public void inviaNotificaVincitore(Long astaId, Long userId, BigDecimal importo) {
		if (astaId == null || userId == null || importo == null) {
			throw new IllegalArgumentException("I parametri non possono essere null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_ASTA_VINTA);
		notifica.setMessaggio("Congratulazioni! Hai vinto l'asta #" + astaId + " con un'offerta di €" + importo);
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(userId);
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(userId.toString(), "/notifica/utente", notifica);
		} catch (Exception e) {
			System.err.println("Errore invio notifica vincitore: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void inviaNotificaTerminazioneAsta(Long astaId, Long userId, String motivoTerminazione) {
		if (astaId == null || userId == null) {
			throw new IllegalArgumentException("I parametri non possono essere null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_ASTA_TERMINATA);
		notifica.setMessaggio("L'asta #" + astaId + " è stata terminata."
				+ (motivoTerminazione != null ? "Motivo: " + motivoTerminazione : ""));
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(userId.toString(), "/notifica/utente", notifica);
		} catch (Exception e) {
			System.err.println("Errore invio notifica terminazione: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void inviaNotificaOffertaSuperata(Long astaId, Long userId, BigDecimal nuovoImporto) {
		if (astaId == null || userId == null || nuovoImporto == null) {
			throw new IllegalArgumentException("I parametri non possono essere null");
		}

		Notifica notifica = new Notifica();
		notifica.setTipo(Notifica.TIPO_OFFERTA_SUPERATA);
		notifica.setMessaggio(
				"La tua offerta per l'asta #" + astaId + " è stata superata. Nuova offerta: €" + nuovoImporto);
		notifica.setAstaId(astaId);
		notifica.setData(LocalDateTime.now());
		notifica.setUserId(userId);
		notifica.setTipoUtente("PARTECIPANTE");

		try {
			notificaMapper.insert(notifica);
			messagingTemplate.convertAndSendToUser(userId.toString(), "/notifica/utente", notifica);
		} catch (Exception e) {
			System.err.println("Errore invio notifica offerta superata: " + e.getMessage());
			e.printStackTrace();
		}
	}
}