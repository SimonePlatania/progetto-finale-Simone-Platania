package com.item.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.item.entity.Item;
import com.item.service.ItemService;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")

public class ItemController {
    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody Item item, @RequestParam Long gestoreId) {
        try {
            logger.info("Ricevuta richiesta di creazione item per gestore ID: {}", gestoreId);
            itemService.createItem(item, gestoreId);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            logger.error("Errore durante la creazione dell'item", e);
            return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
        }
    }

   //28/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/item-controller/{id} 1)
   @GetMapping("/{id}")
   public ResponseEntity<?> getItem(@PathVariable Long id) {
       Item item = itemService.getItemById(id);
       return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
   }

   //28/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/item-controller/gestore/{gestoreId} 2)
   @GetMapping("/gestore/{gestoreId}")
   public ResponseEntity<?> getItemsByGestore(@PathVariable Long gestoreId) {
       return ResponseEntity.ok(itemService.findByGestoreId(gestoreId));
   }
   
}