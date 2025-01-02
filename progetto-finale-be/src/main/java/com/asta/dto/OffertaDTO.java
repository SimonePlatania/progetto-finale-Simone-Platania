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

    public OffertaDTO() {}

    public static OffertaDTO fromOfferta(Offerta offerta, boolean isGestore) {
        OffertaDTO dto = new OffertaDTO();
        dto.setId(offerta.getId());
        dto.setImporto(offerta.getImporto());
        dto.setDataOfferta(offerta.getDataOfferta());
        
        if (isGestore) {
            dto.setUsernameOfferente(offerta.getUsernameOfferente());
        }
        
        return dto;
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