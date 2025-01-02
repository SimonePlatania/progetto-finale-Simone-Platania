package com.asta.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asta.dto.CreaAstaRequest;
import com.asta.entity.Asta;
import com.asta.service.AstaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/aste")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class AstaController {

   private final AstaService astaService;

   public AstaController(AstaService astaService) {
       this.astaService = astaService;
   }

   
   @PostMapping
   public ResponseEntity<?> createAsta(@Valid @RequestBody CreaAstaRequest request, 
                                     @RequestParam Long gestoreId) {
       try {
           Asta asta = astaService.createAsta(request, gestoreId);
           return ResponseEntity.ok(asta);
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   //29/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/asta-controller/attive 1)
   @GetMapping("/attive")
   public ResponseEntity<List<Asta>> getAsteAttive() {
       return ResponseEntity.ok(astaService.getAsteAttive());
   }

   //29/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/asta-controller/{id} 2)
   @GetMapping("/{id}")
   public ResponseEntity<?> getAsta(@PathVariable Long id) {
       try {
           Asta asta = astaService.findById(id);
           return ResponseEntity.ok(asta);
       } catch (Exception e) {
           return ResponseEntity.notFound().build();
       }
   }
   
   //29/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/asta-controller/{astaId}/offerte 3)
   @PostMapping("/{astaId}/offerte")
   public ResponseEntity<?> makeOffer(@PathVariable Long astaId,
                                    @RequestParam Long userId,
                                    @RequestParam BigDecimal importoOfferta) {
       try {
           astaService.faiOfferta(astaId, userId, importoOfferta);
           return ResponseEntity.ok().build();
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

 //29/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/asta-controller/vinte/{userId} 4)
   @GetMapping("/vinte/{userId}")
   public ResponseEntity<List<Asta>> getAsteVinte(@PathVariable Long userId) {
       return ResponseEntity.ok(astaService.getAsteVinte(userId));
   }
   //29/12/2024 Simone http://localhost:8080/webjars/swagger-ui/index.html#/asta-controller/{astaId}/termina 5)
   @PostMapping("/{astaId}/termina")
   public ResponseEntity<?> terminaAsta(@PathVariable Long astaId,
                                      @RequestParam Long gestoreId) {
       try {
           astaService.terminaAsta(astaId, gestoreId);
           return ResponseEntity.ok().build();
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
}