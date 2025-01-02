package com.asta.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Offerta {
	
	private Long id;
	private Long itemId;
	private Long astaId;
	private Long utenteId;
	private BigDecimal importo;
	private LocalDateTime dataOfferta;
	private String usernameOfferente;
	
	public Offerta () {}

	public Offerta(Long id, Long itemId, Long astaId, Long utenteId, BigDecimal importo, LocalDateTime dataOfferta,
			String usernameOfferente) {
		super();
		this.itemId = itemId;
		this.astaId = astaId;
		this.utenteId = utenteId;
		this.importo = importo;
		this.dataOfferta = dataOfferta;
	}
	
	public Offerta (Long id, Long astaId, Long utenteId, BigDecimal importo) {
		this.id = id;
		this.astaId = astaId;
		this.utenteId = utenteId;
		this.importo = importo;
	}
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getAstaId() {
		return astaId;
	}

	public void setAstaId(Long astaId) {
		this.astaId = astaId;
	}

	public Long getUtenteId() {
		return utenteId;
	}

	public void setUtenteId(Long utenteId) {
		this.utenteId = utenteId;
	}

	public BigDecimal getImporto() {
		return importo;
	}

	public void setImporto(BigDecimal importo) {
		this.importo = importo;
	}

	public LocalDateTime getDataOfferta() {
		return dataOfferta;
	}

	public void setDataOfferta(LocalDateTime dataOfferta) {
		this.dataOfferta = dataOfferta;
	}

	public String getUsernameOfferente() {
		return usernameOfferente;
	}

	public void setUsernameOfferente(String usernameOfferente) {
		this.usernameOfferente = usernameOfferente;
	}

	public Long getItemId() {
		return itemId;
	}

	public void setItemId(Long itemId) {
		this.itemId = itemId;
	}
	
	
	
	

}
