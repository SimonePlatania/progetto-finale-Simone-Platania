package com.item.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Item {
    private Long id;
    private String nome;
    private String descrizione;
    private BigDecimal prezzoBase;
    private BigDecimal rilancioMinimo;
    private LocalDateTime dataCreazione;
    private Boolean inAsta;
    private Long gestoreId;
    private String gestoreUsername;
    
    public Item() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    return rilancioMinimo; }
    
    public void setRilancioMinimo(BigDecimal rilancioMinimo) {
    this.rilancioMinimo = rilancioMinimo; 
    }
    
    public LocalDateTime getDataCreazione() {
    return dataCreazione; 
    }
    
    public void setDataCreazione(LocalDateTime dataCreazione) {
    this.dataCreazione = dataCreazione; 
    }
    
    public Boolean getInAsta() {
    return inAsta; 
    }
    public void setInAsta(Boolean inAsta) {
    this.inAsta = inAsta; 
    }
    
    public Long getGestoreId() {
    return gestoreId; 
    }
    
    public void setGestoreId(Long gestoreId) {
    this.gestoreId = gestoreId; 
    }
    
    public String getGestoreUsername() {
    return gestoreUsername;
    }
    
    public void setGestoreUsername(String gestoreUsername) {
    this.gestoreUsername = gestoreUsername; 
    }
}