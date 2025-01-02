package com.login.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.login.controller.UtenteController;
import com.login.dto.GestoreRegisterRequest;
import com.login.dto.LoginRequest;
import com.login.dto.LoginResponse;
import com.login.dto.ProfiloUpdateRequest;
import com.login.dto.RegisterRequest;
import com.login.entity.Utente;
import com.login.mapper.SessioneMapper;
import com.login.mapper.UtenteMapper;

@Service
public class UtenteService {

	private final UtenteMapper utenteMapper;
	private final PasswordEncoder passwordEncoder;
	private SessioneMapper sessioneMapper;
	private static final Logger logger = LoggerFactory.getLogger(UtenteController.class);
	private static final String CODICE_GESTORE = "GESTORE2024";

	public UtenteService(UtenteMapper utenteMapper, PasswordEncoder passwordEncoder, SessioneMapper sessioneMapper) {
		this.utenteMapper = utenteMapper;
		this.passwordEncoder = passwordEncoder;
		this.sessioneMapper = sessioneMapper;
	}

	@Transactional
	public void registra(RegisterRequest request) {
		validateRegistration(request);

		Utente utente = new Utente();
		utente.setUsername(request.getUsername());
		utente.setEmail(request.getEmail());
		utente.setPassword(passwordEncoder.encode(request.getPassword()));

		// 28/12/2024 Simone AGGIUNTA LA POSSIBILITA AD UN GESTORE DI LOGGARSI NEL
		// SISTEMA TRAMITE CODICE
		if (request instanceof GestoreRegisterRequest) {
			GestoreRegisterRequest gestoreRequest = (GestoreRegisterRequest) request;
			if (!CODICE_GESTORE.equals(gestoreRequest.getCodiceGestore())) {
				throw new RuntimeException("Codice gestore non valido");
			}
			utente.setRuolo("GESTORE");

		} else {
			utente.setRuolo("PARTECIPANTE");
		}

		utente.setDataCreazione(LocalDateTime.now());
		utenteMapper.insert(utente);
	}

	// 24/12/2024 Simone TUTTE LE VALIDAZIONI NECESSARIE AL FINE DELLA REGISTRAZIONE
	// 0)
	public void validateRegistration(RegisterRequest request) {

		if (utenteMapper.existsByUsername(request.getUsername())) {
			throw new RuntimeException("Username già in uso");
		}

		if (utenteMapper.findByEmail(request.getEmail()) != null) {
			throw new RuntimeException("Email già registrata");
		}

		if (!isValidPassword(request.getPassword())) {
			throw new RuntimeException("Password non valida: minimo 6 caratteri, una maiuscola e una minuscola");
		}

	}

	public boolean isValidPassword(String password) {

		return password.length() >= 6 && password.matches(".*[A-Z].*") && password.matches(".*[0-9].*");

	}

	@Transactional
	public LoginResponse login(LoginRequest request) {
	    logger.info("Tentativo di login per username: {}", request.getUsername());
	    
	    // Verifica utente
	    Utente utente = utenteMapper.findByUsername(request.getUsername());
	    if (utente == null) {
	        throw new RuntimeException("Username non trovato");
	    }

	    // Verifica password
	    if (!passwordEncoder.matches(request.getPassword(), utente.getPassword())) {
	        throw new RuntimeException("Password non valida");
	    }

	    // Genera un sessionId unico
	    String sessionId = UUID.randomUUID().toString();
	    
	    // Salva la sessione nel database
	    try {
	        utenteMapper.insertSessione(sessionId, utente.getId(), LocalDateTime.now(), LocalDateTime.now());
	        logger.info("Sessione creata con successo per l'utente: {}", utente.getUsername());
	    } catch (Exception e) {
	        logger.error("Errore durante la creazione della sessione", e);
	        throw new RuntimeException("Errore durante il login");
	    }

	    return new LoginResponse(sessionId, utente);
	}

	// 24/12/2024 Simone AGGIORNAMENTO UTENTE 1)
	@Transactional
	public Utente aggiornaUtente(Long id, ProfiloUpdateRequest request) {
		logger.info("Inizio aggiornamento utente con ID: {}", id);

		if (request == null) {
			throw new RuntimeException("La richiesta non può essere nulla");
		}

		// 24/12/2024 Simone RECUPERA UTENTE ESISTENTE 2)
		Utente utente = utenteMapper.findById(id);
		if (utente == null) {
			logger.error("Utente non trovato con ID: {}", id);
			throw new RuntimeException("Utente non trovato con ID: " + id);
		}

		boolean modificheEffettuate = false;

		// 24/12/2024 Simone VERIFICA USERNAME 3)
		if (request.getUsername() != null && !request.getUsername().equals(utente.getUsername())) {
			logger.info("Richiesta modifica username da '{}' a '{}'", utente.getUsername(), request.getUsername());
			if (utenteMapper.existsByUsername(request.getUsername())) {
				logger.error("Username '{}' già in uso", request.getUsername());
				throw new RuntimeException("Username già in uso");
			}
			utente.setUsername(request.getUsername());
			modificheEffettuate = true;
		}

		// 24/12/2024 Simone VERIFICA EMAIL 4)
		if (request.getEmail() != null && !request.getEmail().equals(utente.getEmail())) {
			logger.info("Richiesta modifica email da '{}' a '{}'", utente.getEmail(), request.getEmail());
			if (utenteMapper.findByEmail(request.getEmail()) != null) {
				logger.error("Email '{}' già in uso", request.getEmail());
				throw new RuntimeException("Email già in uso");
			}
			utente.setEmail(request.getEmail());
			modificheEffettuate = true;
		}

		// 25/12/2024 Simone TRACCIAMENTO BUG, NON RIUSCIVO A VISUALIZZARE I DATI DI UN
		// UTENTE QUANDO LI MODIFICAVO 5)
		if (modificheEffettuate) {
			logger.info("Dati prima dell'aggiornamento: {}", utente);
			utenteMapper.updateUtente(utente);
			Utente utenteAggiornato = utenteMapper.findById(id);
			logger.info("Dati dopo l'aggiornamento: {}", utenteAggiornato);
			return utenteAggiornato;
		} else {
			logger.info("Nessuna modifica necessaria per utente ID: {}", id);
		}

		return utente;
	}
	
	public Utente getCurrentUser(String sessionId) {
        if (sessionId == null) {
            throw new RuntimeException("Sessione non valida");
        }
        
        Utente utente = sessioneMapper.findUtenteByValidSessionId(sessionId);
        if (utente == null) {
            throw new RuntimeException("Sessione non valida o scaduta");
        }
        
        sessioneMapper.updateLastAccessTime(sessionId);
        
        return utente;
    }
}