package com.asta.entity;
import java.time.LocalDateTime;

public class Notifica {
    private String tipo;        
    private String messaggio;
    private Long astaId;
    private LocalDateTime data;
    private Long userId;
    
	public Notifica() {
		super();
	}
	
	public Notifica(String tipo, String messaggio, Long astaId, LocalDateTime data, Long userId) {
		super();
		this.tipo = tipo;
		this.messaggio = messaggio;
		this.astaId = astaId;
		this.data = data;
		this.userId = userId;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public String getMessaggio() {
		return messaggio;
	}
	public void setMessaggio(String messaggio) {
		this.messaggio = messaggio;
	}
	public Long getAstaId() {
		return astaId;
	}
	public void setAstaId(Long astaId) {
		this.astaId = astaId;
	}
	public LocalDateTime getData() {
		return data;
	}
	public void setData(LocalDateTime data) {
		this.data = data;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}        
    
    
    

}