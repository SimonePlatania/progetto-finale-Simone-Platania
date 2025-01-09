package com.item.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.item.entity.Item;
import com.item.mapper.ItemMapper;
import com.item.service.ItemService;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")

public class ItemController {
	private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
	private final ItemService itemService;
	private final ItemMapper itemMapper;

	public ItemController(ItemService itemService, ItemMapper itemMapper) {
		this.itemService = itemService;
		this.itemMapper = itemMapper;
	}

	@PostMapping
	public ResponseEntity<?> createItem(@RequestBody Item item, @RequestParam Long gestoreId) {
		logger.info("Ricevuta richiesta di creazione item per gestore ID: {}", gestoreId);
		try {
			itemService.createItem(item, gestoreId);
			return ResponseEntity.ok(item);
		} catch (Exception e) {
			logger.error("Errore durante la creazione dell'item", e);
	        logger.info("Ricevuto item con imageUrl: {}", item.getImageUrl());
			return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
		}
	}

	// 28/12/2024 Simone
	// http://localhost:8080/webjars/swagger-ui/index.html#/item-controller/{id} 1)
	@GetMapping("/{id}")
	public ResponseEntity<?> getItem(@PathVariable Long id) {
		Item item = itemService.getItemById(id);
		return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
	}

	// 28/12/2024 Simone
	// http://localhost:8080/webjars/swagger-ui/index.html#/item-controller/gestore/{gestoreId}
	// 2)
	@GetMapping("/gestore/{gestoreId}")
	public ResponseEntity<?> getItemsByGestore(@PathVariable Long gestoreId) {
		return ResponseEntity.ok(itemService.findByGestoreId(gestoreId));
	}

	@GetMapping
	public ResponseEntity<List<Item>> getAllItems() {
		try {
			logger.info("Ricevuta richiesta per tutti gli items");
			List<Item> items = itemService.findAll();
			return ResponseEntity.ok(items);
		} catch (Exception e) {
			logger.error("Errore durante il recupero degli items", e);
			return ResponseEntity.badRequest().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteItem(@PathVariable Long id, @RequestParam Long gestoreId) {
	    try {
	        logger.info("Tentativo di eliminazione item {} da parte del gestore {}", id, gestoreId);
	        
	        Item item = itemMapper.findById(id);
	        if (item == null) {
	            logger.warn("Item {} non trovato", id);
	            return ResponseEntity.notFound().build();
	        }
	        
	        logger.info("Item trovato: {}", item);
	        
	        if (!item.getGestoreId().equals(gestoreId)) {
	            logger.warn("Tentativo non autorizzato di eliminazione. GestoreId dell'item: {}, GestoreId richiedente: {}", 
	                       item.getGestoreId(), gestoreId);
	            return ResponseEntity.status(403).body("Non autorizzato");
	        }
	        
	        if (item.getInAsta()) {
	            logger.warn("Tentativo di eliminazione di item in asta: {}", id);
	            return ResponseEntity.badRequest()
	                    .body("Non puoi eliminare un oggetto in asta, però puoi terminare un'asta");
	        }

	        itemMapper.delete(id);
	        logger.info("Item {} eliminato con successo", id);
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        logger.error("Errore durante l'eliminazione dell'item {}", id, e);
	        return ResponseEntity.badRequest().body("Errore durante l'eliminazione dell'oggetto");
	    }
	}
	
		@PutMapping("/{id}")
		public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestParam Long gestoreId, @RequestBody Item updatedItem) {
			
			try {
				Item existingItem = itemMapper.findById(id);
				if (existingItem == null) {
					return ResponseEntity.notFound().build();
				}
				if(!existingItem.getGestoreId().equals(gestoreId)) {
					return ResponseEntity.status(403).body("Non autorizzato");
				}
				if (existingItem.getInAsta()) {
					return ResponseEntity.badRequest().body("Non puoi modificare un oggetto in asta");
				}
				 if (updatedItem.getPrezzoBase().compareTo(BigDecimal.ZERO) <= 0) {
			            return ResponseEntity.badRequest().body("Il prezzo base deve essere maggiore di zero");
			        }

			        if (updatedItem.getRilancioMinimo().compareTo(BigDecimal.ZERO) <= 0) {
			            return ResponseEntity.badRequest().body("Il rilancio minimo deve essere maggiore di zero");
			        }

			        // Confronto tra prezzoBase e rilancioMinimo
			        if (updatedItem.getRilancioMinimo().compareTo(updatedItem.getPrezzoBase()) >= 0) {
			            return ResponseEntity.badRequest()
			                .body("Il rilancio minimo deve essere minore del prezzo base");
			        }
				
				existingItem.setNome(updatedItem.getNome());
				existingItem.setDescrizione(updatedItem.getDescrizione());
				existingItem.setPrezzoBase(updatedItem.getPrezzoBase());
				existingItem.setRilancioMinimo(updatedItem.getRilancioMinimo());
				
				itemMapper.update(existingItem);
				return ResponseEntity.ok(existingItem);
				
			} catch (Exception e) {
				return ResponseEntity.badRequest().body("Errore durante l'aggiornamento dell'oggetto");
			}
		}
		
		//AGGIUNTO METODO PER IMPLEMENTARE UPLOAD
		
		@PostMapping("/uploads")
		public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
			   logger.info("Inizio upload file: {}", file.getOriginalFilename());
			   logger.info("Dimensione file: {} bytes", file.getSize());
			
			try {
				String uploadDir = "src/main/resources/static/uploads/";
				Path uploadPath = Paths.get(uploadDir);
				
		        logger.info("Verifico directory: {}", uploadDir);
				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}
				
				String fileName = UUID.randomUUID() + "_" +file.getOriginalFilename();
				Path filePath = uploadPath.resolve(fileName);
				
		        logger.info("Salvo file come: {}", fileName);
				Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
				
		        logger.info("File salvato con successo. URL: {}", fileName);
				return ResponseEntity.ok("/uploads/" + fileName);

			} catch (IOException e) {
		        logger.error("Errore durante l'upload:", e);
				return ResponseEntity.badRequest().body("Errore upload: " + e.getMessage());
			}
		}

}