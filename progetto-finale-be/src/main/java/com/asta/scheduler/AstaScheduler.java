package com.asta.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.asta.service.AstaService;

//29/12/24 Simone Questa classe mi consente di analizzare ogni minute le aste, in modo tale da poter checkare quando una scade.
@Component
public class AstaScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(AstaScheduler.class);
    private final AstaService astaService;

    public AstaScheduler(AstaService astaService) {
        this.astaService = astaService;
    }

    @Scheduled(fixedRate = 60000) 
    public void checkAsteScadute() {
        logger.info("Avvio controllo aste scadute: {}", java.time.LocalDateTime.now());
        try {
            astaService.checkAsteScadute();
            logger.info("Controllo aste scadute completato");
        } catch (Exception e) {
            logger.error("Errore durante il controllo delle aste scadute", e);
        }
    }
}