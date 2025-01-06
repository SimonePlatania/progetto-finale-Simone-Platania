package com.asta.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.asta.entity.Notifica;

@Service
public class NotificaService {
    private final SimpMessagingTemplate messagingTemplate;
    
    public NotificaService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
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

        try {
            messagingTemplate.convertAndSend("/notifica/utente/" + userId, notifica);
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }

    public void inviaNotificaScadenza(Long astaId, Long userId) {
        if (astaId == null || userId == null) {
            throw new IllegalArgumentException("I parametri non possono essere vuoti");
        }

        Notifica notifica = new Notifica();
        notifica.setTipo("ASTA_SCADUTA");
        notifica.setMessaggio("L'asta #" + astaId + " sta per scadere!");
        notifica.setAstaId(astaId);
        notifica.setData(LocalDateTime.now());  
        notifica.setUserId(userId);

        try {
            messagingTemplate.convertAndSend("/notifica/utente/" + userId, notifica);
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }
}