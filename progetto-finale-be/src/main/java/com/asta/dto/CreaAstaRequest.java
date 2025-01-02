package com.asta.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

public class CreaAstaRequest {
	
	  @NotNull(message = "ID dell'item è obbligatorio")
	    private Long itemId;
	    
	    private LocalDateTime dataInizio;
	    
	    @NotNull(message = "Data fine è obbligatoria")
	    private LocalDateTime dataFine;
	    
	    private Boolean startNow = false;
	    
	    	

		public Boolean isStartNow() {
			return startNow;
		}

		public void setStartNow(Boolean startNow) {
			this.startNow = startNow;
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
		
		//01/01/25 Simone Aggiunto assertTrue, perché fallisce se il secondo parametro diventa false, garantendo che il valore sia true.
		@AssertTrue(message = "Data inizio è obbligatoria se l'asta non inizia immediatamente")
		private Boolean isDataInizioValida() {
			
			return startNow || dataInizio != null;
			
		}
	    
	 
	}


