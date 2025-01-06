package com.notifica.entity;
import java.time.LocalDateTime;

public class Notifica {
    public static final String TIPO_NUOVA_OFFERTA = "NUOVA_OFFERTA";
    public static final String TIPO_ASTA_SCADUTA = "ASTA_SCADUTA";
    public static final String TIPO_PARTECIPAZIONE_ASTA = "PARTECIPAZIONE_ASTA";

    private Long id;
    private String tipo;
    private String messaggio;
    private Long astaId;
    private LocalDateTime data;
    private Long userId;
    private boolean letta;       
    private String tipoUtente;    

    public Notifica() {
        super();
        this.letta = false;
        this.data = LocalDateTime.now();
    }

    public Notifica(String tipo, String messaggio, Long astaId, Long userId, String tipoUtente) {
        this();
        this.tipo = tipo;
        this.messaggio = messaggio;
        this.astaId = astaId;
        this.userId = userId;
        this.tipoUtente = tipoUtente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isLetta() {
        return letta;
    }

    public void setLetta(boolean letta) {
        this.letta = letta;
    }

    public String getTipoUtente() {
        return tipoUtente;
    }

    public void setTipoUtente(String tipoUtente) {
        this.tipoUtente = tipoUtente;
    }

    @Override
    public String toString() {
        return "Notifica{" +
                "id=" + id +
                ", tipo='" + tipo + '\'' +
                ", messaggio='" + messaggio + '\'' +
                ", astaId=" + astaId +
                ", data=" + data +
                ", userId=" + userId +
                ", letta=" + letta +
                ", tipoUtente='" + tipoUtente + '\'' +
                '}';
    }
}