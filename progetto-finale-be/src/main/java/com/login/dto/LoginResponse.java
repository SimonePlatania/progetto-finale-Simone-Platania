package com.login.dto;

import com.login.entity.Utente;

public class LoginResponse {
	
	private String sessionId;
	private Utente utente;
	
	public LoginResponse(String sessionId, Utente utente) {
		this.sessionId  = sessionId;
		this.utente = utente;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public Utente getUtente() {
		return utente;
	}

	public void setUtente(Utente utente) {
		this.utente = utente;
	}
	


}
