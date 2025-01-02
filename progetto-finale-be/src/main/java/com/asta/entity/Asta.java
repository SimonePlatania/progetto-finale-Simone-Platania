package com.asta.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Asta {
	
	private Long id;
	private Long itemId;
	private LocalDateTime dataInizio;
	private LocalDateTime dataFine;
	private BigDecimal offertaCorrente;
	private Long offertaCorrenteId;
	private Boolean isAttiva;
	private String stato;
	private String nomeItem;
	private String usernameOfferente;
	private Boolean isStartNow;
	
	public Asta(Long id, Long itemId, LocalDateTime dataInizio, LocalDateTime dataFine, BigDecimal offertaCorrente,
			Long offertaCorrenteId, Boolean isAttiva, String stato, String nomeItem, String usernameOfferente, Boolean isStartNow) {
		super();
		this.id = id;
		this.itemId = itemId;
		this.dataInizio = dataInizio;
		this.dataFine = dataFine;
		this.offertaCorrente = offertaCorrente;
		this.offertaCorrenteId = offertaCorrenteId;
		this.isAttiva = isAttiva;
		this.stato = stato;
		this.nomeItem = nomeItem;
		this.usernameOfferente = usernameOfferente;
		this.isStartNow = isStartNow;
	}
	
	
	public Asta() {
		super();
	}
	
	public Boolean isStartNow() {
		return isStartNow;
	}


	public void setStartNow(Boolean isStartNow) {
		this.isStartNow = isStartNow;
	}


	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getItemId() {
		return itemId;
	}
	public void setItemId(Long itemId) {
		this.itemId = itemId;
	}
	public LocalDateTime getDataInizio() {
		return dataInizio;
	}
	public void setDataInizio(LocalDateTime dataInizio) {
		this.dataInizio = dataInizio;
	}
	public LocalDateTime getDataFine() {
		return dataFine;
	}
	public void setDataFine(LocalDateTime dataFine) {
		this.dataFine = dataFine;
	}
	public BigDecimal getOffertaCorrente() {
		return offertaCorrente;
	}
	public void setOffertaCorrente(BigDecimal offertaCorrente) {
		this.offertaCorrente = offertaCorrente;
	}
	public Long getOffertaCorrenteId() {
		return offertaCorrenteId;
	}
	public void setOffertaCorrenteId(Long offertaCorrenteId) {
		this.offertaCorrenteId = offertaCorrenteId;
	}
	public Boolean getIsAttiva() {
		return isAttiva;
	}
	public void setIsAttiva(Boolean isAttiva) {
		this.isAttiva = isAttiva;
	}
	public String getStato() {
		return stato;
	}
	public void setStato(String stato) {
		this.stato = stato;
	}
	public String getNomeItem() {
		return nomeItem;
	}
	public void setNomeItem(String nomeItem) {
		this.nomeItem = nomeItem;
	}
	public String getUsernameOfferente() {
		return usernameOfferente;
	}
	public void setUsernameOfferente(String usernameOfferente) {
		this.usernameOfferente = usernameOfferente;
	}
	
	

}
