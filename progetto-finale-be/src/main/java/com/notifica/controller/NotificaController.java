package com.notifica.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notifica.entity.Notifica;
import com.notifica.service.NotificaService;


@RestController
@RequestMapping("/api/notifiche")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class NotificaController {
	
    private final Logger logger = LoggerFactory.getLogger(NotificaController.class);
    private final NotificaService notificaService;
    
    public NotificaController(NotificaService notificaService) {
        this.notificaService = notificaService;
    }

    @GetMapping("/utente/{userId}")
    public ResponseEntity<List<Notifica>> getNotificheUtente(@PathVariable Long userId) {
        List<Notifica> notifiche = notificaService.getNotificheUtente(userId);
        return ResponseEntity.ok(notifiche);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificaService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/utente/{userId}/clear")
    public ResponseEntity<?> clearAllNotifications(
        @PathVariable Long userId) {
        try {
            List<Notifica> notificheAggiornate = notificaService.markAllAsRead(userId);
            return ResponseEntity.ok(notificheAggiornate);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Errore durante la pulizia delle notifiche: " + e.getMessage());
        }
    }
}