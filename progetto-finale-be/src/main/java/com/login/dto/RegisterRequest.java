package com.login.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
	
	@NotBlank(message = "Username non può essere vuoto")
	@Size(min = 3, max = 30, message = "Username deve essere compreso tra i 3 ed i 30 caratteri")
	private String username;
	
	@NotBlank(message = "Email non può essere vuota")
	@Email(message = "Email non valida")
	private String email;
	
	@NotBlank(message = "La password non può essere vuota")
	@Size(min = 6, max = 64, message = "La password deve contenere almeno 6 caratteri")
	@Schema(description = "Password utente", minLength = 6, maxLength = 64)
	private String password;
	
	public RegisterRequest() {}

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
	

}
