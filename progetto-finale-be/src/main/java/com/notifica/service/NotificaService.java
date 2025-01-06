package com.notifica.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    public void inviaNotificaOfferta(Long astaId, Long userId, BigDecimal importo) {
        if (astaId == null || userId == null || importo == null) {
            throw new IllegalArgumentException("Parameters cannot be null");
        }
        
        Notifica notifica = new Notifica();
        notifica.setTipo("NUOVA_OFFERTA");
        notifica.setMessaggio("Nuova offerta di €" + importo + " per l'asta #" + astaId);
        notifica.setAstaId(astaId);
        notifica.setData(LocalDateTime.now());
        notifica.setUserId(userId);
        notifica.setTipoUtente("PARTECIPANTE");

        try {
            notificaMapper.insert(notifica);
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/notifica/utente",
                notifica
            );
            System.out.println("Notifica offerta inviata a: " + userId);
        } catch (Exception e) {
            System.err.println("Errore invio notifica offerta: " + e.getMessage());
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
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/notifica/utente",
                notifica
            );
        } catch (Exception e) {
            System.err.println("Errore invio notifica scadenza: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void inviaNotificaPartecipazione(Long astaId, Long userId, Long gestoreId, String usernamePartecipante) {
        if (astaId == null || userId == null || gestoreId == null) {
            throw new IllegalArgumentException("Parameters cannot be null");
        }
        
        Notifica notifica = new Notifica();
        notifica.setTipo("PARTECIPAZIONE_ASTA");
        notifica.setMessaggio("L'utente " + usernamePartecipante + " ha partecipato all'asta #" + astaId);
        notifica.setAstaId(astaId);
        notifica.setData(LocalDateTime.now());
        notifica.setUserId(gestoreId);
        notifica.setTipoUtente("GESTORE");

        try {
            notificaMapper.insert(notifica);
            messagingTemplate.convertAndSendToUser(
                gestoreId.toString(),
                "/notifica/utente",
                notifica
            );
            System.out.println("Notifica partecipazione inviata al gestore: " + gestoreId);
        } catch (Exception e) {
            System.err.println("Errore invio notifica partecipazione: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Aggiungi questi due metodi
    public List<Notifica> getNotificheUtente(Long userId) {
        return notificaMapper.findByUserId(userId);
    }

    public void markAsRead(Long id) {
        notificaMapper.markAsRead(id);
    }
}