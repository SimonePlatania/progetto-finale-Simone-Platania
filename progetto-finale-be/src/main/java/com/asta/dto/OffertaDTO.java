package com.asta.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.asta.entity.Offerta;

public class OffertaDTO {
    private Long id;
    private Long itemId;
    private Long astaId;
    private Long utenteId;
    private BigDecimal importo;
    private LocalDateTime dataOfferta;
    private String usernameOfferente; 
    private boolean currentUserOfferta;
    
    //07/01 Stavo avendo problemi a visualizzare se l'offerta l'avessi fatta io

    public OffertaDTO() {}

    public static OffertaDTO fromOfferta(Offerta offerta, boolean isGestore, Long currentUserId) {
        OffertaDTO dto = new OffertaDTO();
        dto.setId(offerta.getId());
        dto.setImporto(offerta.getImporto());
        dto.setDataOfferta(offerta.getDataOfferta());
        
        dto.setCurrentUserOfferta(offerta.getUtenteId().equals(currentUserId));
        
        if (isGestore) {
            dto.setUsernameOfferente(offerta.getUsernameOfferente());
        }
        
        return dto;
    }
    
    
	public boolean getCurrentUserOfferta() {
		return currentUserOfferta;
	}

	public void setCurrentUserOfferta(boolean currentUserOfferta) {
		this.currentUserOfferta = currentUserOfferta;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    
}