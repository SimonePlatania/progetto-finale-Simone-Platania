package com.login.dto;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
	
	@NotBlank(message = "Username non può essere vuoto")
	private String username;
	
	@NotBlank(message = "La password non può essere vuota")
	private String password;
	
	public LoginRequest(){}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
		
	}
	
}
