package com.item.dto;

import java.math.BigDecimal;

public class ItemDTO {
    private String nome;
    private String descrizione;
    private BigDecimal prezzoBase;
    private BigDecimal rilancioMinimo;
    
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getDescrizione() {
		return descrizione;
	}
	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}
	public BigDecimal getPrezzoBase() {
		return prezzoBase;
	}
	public void setPrezzoBase(BigDecimal prezzoBase) {
		this.prezzoBase = prezzoBase;
	}
	public BigDecimal getRilancioMinimo() {
		return rilancioMinimo;
	}
	public void setRilancioMinimo(BigDecimal rilancioMinimo) {
		this.rilancioMinimo = rilancioMinimo;
	}

}