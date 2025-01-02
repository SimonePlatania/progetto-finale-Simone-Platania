package com.login.dto;

import jakarta.validation.constraints.NotBlank;

public class GestoreRegisterRequest extends RegisterRequest {
	
	@NotBlank(message = "Il codice gestore non può essere vuoto")
	private String codiceGestore;
	
	public GestoreRegisterRequest() {
		super();
	}

	public String getCodiceGestore() {
		return codiceGestore;
	}

	public void setCodiceGestore(String codiceGestore) {
		this.codiceGestore = codiceGestore;
	}
	
	

}
