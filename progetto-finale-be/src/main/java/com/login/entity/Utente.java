package com.login.entity;
import java.time.LocalDateTime;

public class Utente {
	
	private Long id;
	private String username;
	private String email;
	private String password;
	private String ruolo;
	private LocalDateTime dataCreazione;
	
	public Utente () {
	}
	
	public Utente (String username, String email, String password, String ruolo) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.ruolo = ruolo;
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRuolo() {
		return ruolo;
	}

	public void setRuolo(String ruolo) {
		this.ruolo = ruolo;
	}

	public LocalDateTime getDataCreazione() {
		return dataCreazione;
	}

	public void setDataCreazione(LocalDateTime dataCreazione) {
		this.dataCreazione = dataCreazione;
	}

	@Override
	public String toString() {
		return "Utente{" + 
				"["+
				"id=" + id + 
				", username=" + username + 
				", email=" + email + 
				", password=" + password+ 
				", ruolo=" + ruolo + 
				", dataCreazione=" + dataCreazione + 
				"]";
	}
	
}
