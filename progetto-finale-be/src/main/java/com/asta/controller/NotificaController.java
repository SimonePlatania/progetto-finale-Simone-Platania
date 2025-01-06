package com.asta.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.asta.entity.Notifica;

@Controller
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class NotificaController {

    @MessageMapping("/notifica")
    @SendToUser("/notifica/utente")
    public Notifica handleNotifica(@Payload Notifica notifica, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("userId", notifica.getUserId());
        
        return notifica;
    }
}