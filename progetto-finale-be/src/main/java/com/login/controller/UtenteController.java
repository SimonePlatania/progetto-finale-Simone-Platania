package com.login.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.login.dto.GestoreRegisterRequest;
import com.login.dto.LoginRequest;
import com.login.dto.LoginResponse;
import com.login.dto.ProfiloUpdateRequest;
import com.login.dto.RegisterRequest;
import com.login.entity.Utente;
import com.login.service.UtenteService;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")

public class UtenteController {

	private static final Logger logger = LoggerFactory.getLogger(UtenteController.class);
	private final UtenteService utenteService;

	public UtenteController(UtenteService utenteService) {
		this.utenteService = utenteService;
	}

	//24/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/login-controller/registra 1)
	@PostMapping("/registra")
    public ResponseEntity<?> registra(@RequestBody RegisterRequest request) {
        logger.info("Ricevuta richiesta di registrazione per username: {}", request.getUsername());
        try {
            utenteService.registra(request);
            return ResponseEntity.ok("Registrazione completata con successo");
        } catch (Exception e) {
            logger.error("Errore durante la registrazione", e);
            return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
        }
    }

	//24/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/login-controller/registra/gestore 2)
    @PostMapping("/registra/gestore")
    public ResponseEntity<?> registraGestore(@RequestBody GestoreRegisterRequest request) {
        logger.info("Ricevuta richiesta di registrazione gestore per username: {}", request.getUsername());
        try {
            utenteService.registra(request);
            return ResponseEntity.ok("Registrazione gestore completata con successo");
        } catch (Exception e) {
            logger.error("Errore durante la registrazione gestore", e);
            return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
        }
    }

  //24/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/login-controller/login 3)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String sessionId) {
        logger.info("Ricevuta richiesta per ottenere l'utente corrente");
        try {
            Utente utente = utenteService.getCurrentUser(sessionId);
            return ResponseEntity.ok(utente);
        } catch (Exception e) {
            logger.error("Errore nel recupero dell'utente corrente", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Ricevuta richiesta di login per username: {}", request.getUsername());
        try {
            LoginResponse response = utenteService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Errore durante il login", e);
            return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> aggiornaUtente(
            @PathVariable Long id, 
            @RequestBody ProfiloUpdateRequest request,
            @RequestHeader("Authorization") String sessionId) {
        logger.info("Ricevuta richiesta di aggiornamento per utente ID: " + id);
        try {
            // 02/01/2025 Simone VEDERE SE UN UTENTE è autorizzato!
            Utente utenteCorrente = utenteService.getCurrentUser(sessionId);
            if (!utenteCorrente.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Non autorizzato");
            }
            
            Utente utenteAggiornato = utenteService.aggiornaUtente(id, request);
            logger.info("Utente aggiornato con successo: {}", utenteAggiornato);
            return ResponseEntity.ok(utenteAggiornato);
        } catch (Exception e) {
            logger.error("Errore durante l'aggiornamento dell'utente", e);
            return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
        }
    }
}