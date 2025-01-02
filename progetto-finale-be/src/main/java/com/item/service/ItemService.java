package com.item.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.item.entity.Item;
import com.item.exception.ItemNotFoundException;
import com.item.mapper.ItemMapper;
import com.login.entity.Utente;
import com.login.mapper.UtenteMapper;

@Service
public class ItemService {
    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemMapper itemMapper;
    private final UtenteMapper utenteMapper;

    public ItemService(ItemMapper itemMapper, UtenteMapper utenteMapper) {
        this.itemMapper = itemMapper;
        this.utenteMapper = utenteMapper;
    }

    @Transactional
    public void createItem(Item item, Long gestoreId) {
        logger.info("Creazione nuovo item per gestore ID: {}", gestoreId);
        
        if (!isGestore(gestoreId)) {
            logger.error("Tentativo di creazione item da un non-gestore. ID: {}", gestoreId);
            throw new RuntimeException("Accesso negato: ruolo gestore richiesto");
        }

        validateItem(item);

        item.setDataCreazione(LocalDateTime.now());
        item.setInAsta(false);
        item.setGestoreId(gestoreId);

        String gestoreUsername = utenteMapper.findUsernameById(gestoreId);
        if (gestoreUsername != null) {
            item.setGestoreUsername(gestoreUsername);
        }

        try {
            logger.info("Inserimento item nel database");
            itemMapper.insert(item);
            logger.info("Item inserito con successo. ID generato: {}", item.getId());
        } catch (Exception e) {
            logger.error("Errore durante l'inserimento dell'item", e);
            throw new RuntimeException("Errore durante l'inserimento dell'item: " + e.getMessage());
        }
    }

    private void validateItem(Item item) {
        logger.info("Validazione item");
        if (item.getNome() == null || item.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Il nome dell'item è obbligatorio");
        }
        if (item.getPrezzoBase() == null) {
            throw new IllegalArgumentException("Il prezzo base è obbligatorio");
        }
        if (item.getRilancioMinimo() == null) {
            throw new IllegalArgumentException("Il rilancio minimo è obbligatorio");
        }
    }

    private boolean isGestore(Long userId) {
        Utente utente = utenteMapper.findById(userId);
        return utente != null && "GESTORE".equals(utente.getRuolo());
    }

	@Transactional
	public void updateItem(Item item, Long gestoreId) {
		Item existingItem = itemMapper.findById(item.getId());
		if (!existingItem.getGestoreId().equals(gestoreId)) {
			throw new RuntimeException("Non autorizzato a modificare questo item");
		}
		validateItem(item);
		itemMapper.update(item);
	}

	@Transactional
	public void deleteItem(Long itemId, Long gestoreId) {
		Item item = itemMapper.findById(itemId);
		if (!item.getGestoreId().equals(gestoreId)) {
			throw new RuntimeException("Non autorizzato a eliminare questo item");
		}
		itemMapper.delete(itemId);
	}

	public Item getItemById(Long id) {
		Item item = itemMapper.findById(id);
		if (item == null) {
			throw new ItemNotFoundException("Item non trovato con id: " + id);
		}
		return item;
	}

	public List<Item> findByGestoreId(Long gestoreId) {
		return itemMapper.findByGestoreId(gestoreId);
	}
}
