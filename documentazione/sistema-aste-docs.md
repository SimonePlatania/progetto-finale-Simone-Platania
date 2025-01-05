# Sistema di Aste Online - Documentazione Frontend V2

## Introduzione
Questa documentazione descrive l'implementazione del frontend per un sistema di aste online. Il sistema è costruito utilizzando React e implementa funzionalità per gestori e partecipanti alle aste.

## Architettura del Sistema

### Tecnologie Utilizzate
- React per la costruzione dell'interfaccia utente
- Axios per le chiamate API
- React Router per la navigazione
- Tailwind CSS per lo styling

### Struttura delle Cartelle
```
src/
  ├── components/
  │   ├── Homepage.jsx
  │   ├── AstaDettaglio.jsx
  │   ├── AstePartecipate.jsx
  │   ├── GestoreItems.jsx
  │   ├── Login.jsx
  │   ├── Registra.jsx
  │   └── RegistraGestore.jsx
  └── App.jsx
```

## Componenti Principali

### Homepage
La Homepage è il punto di ingresso principale dell'applicazione. Visualizza tutte le aste attive e fornisce navigazione differenziata per gestori e partecipanti.

Caratteristiche principali:
- Visualizzazione delle aste in una griglia responsive
- Indicatori di stato per ogni asta (attiva/programmata)
- Accesso differenziato alle funzionalità in base al ruolo
- Header con navigazione contestuale

### AstaDettaglio
Questo componente gestisce la visualizzazione dettagliata di una singola asta e permette di fare offerte.

Funzionalità:
- Visualizzazione completa dei dettagli dell'asta
- Form per fare offerte (solo per partecipanti)
- Storico delle offerte
- Gestione differenziata delle informazioni in base al ruolo

### AstePartecipate
Visualizza tutte le aste a cui un utente ha partecipato.

Caratteristiche:
- Lista delle aste con offerte dell'utente
- Stato attuale di ogni asta
- Accesso rapido ai dettagli

### GestoreItems
Interfaccia per i gestori per la creazione e gestione degli oggetti.

Funzionalità:
- Creazione di nuovi oggetti
- Visualizzazione degli oggetti esistenti
- Creazione di aste per gli oggetti

## Gestione dell'Autenticazione
Il sistema utilizza un'autenticazione basata su session ID:
- Il session ID viene memorizzato in localStorage
- Viene incluso in ogni richiesta API nell'header Authorization
- Gestione automatica del logout in caso di sessione scaduta

## Gestione delle Aste

### Stati delle Aste
Un'asta può essere in diversi stati:
- Programmata (non ancora iniziata)
- Attiva (in corso)
- Terminata

### Offerte
Le offerte vengono gestite con diverse validazioni:
- Verifica dell'importo minimo
- Controllo dello stato dell'asta
- Aggiornamento in tempo reale dei dati

## API Integration

### Endpoint Principali
```javascript
// Aste
GET    /api/aste/attive
GET    /api/aste/{id}
POST   /api/aste/{id}/offerte

// Items
GET    /api/items
POST   /api/items
GET    /api/items/{id}

// Utente
GET    /api/utenti/me
GET    /api/aste/partecipate/{userId}
```

### Gestione Errori
Il sistema implementa una gestione degli errori robusta:
- Errori di autenticazione (401)
- Errori di validazione (400)
- Errori di server (500)
- Feedback visuale per l'utente

## Interfaccia Utente

### Design System
L'interfaccia utilizza Tailwind CSS con un design system coerente:
- Colori semantici per gli stati (verde per attivo, giallo per programmato)
- Layout responsive con griglia
- Componenti riutilizzabili
- Feedback visuale per le azioni

### Responsive Design
L'interfaccia si adatta a diverse dimensioni dello schermo:
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## Sicurezza e Privacy
Il sistema implementa diverse misure di sicurezza:
- Gli username degli offerenti sono visibili solo ai gestori
- Validazione lato client delle offerte
- Protezione delle route in base al ruolo
- Gestione sicura delle sessioni

## Best Practices Implementate

### Gestione dello Stato
- Utilizzo di useState per lo stato locale
- Gestione efficiente degli aggiornamenti
- Caricamento dati ottimizzato

### Codice Pulito
- Componenti modulari e riutilizzabili
- Nomi di variabili e funzioni descrittivi
- Commenti dove necessario
- Gestione consistente degli errori

### Performance
- Caricamento lazy dei componenti
- Ottimizzazione delle chiamate API
- Gestione efficiente del re-rendering

## Futuri Miglioramenti Possibili
1. Implementazione di WebSocket per aggiornamenti in tempo reale
2. Sistema di notifiche per nuove offerte
3. Miglioramento della gestione delle sessioni
4. Cache dei dati lato client
5. Implementazione di unit test

## Conclusioni
Questa implementazione fornisce una base solida per un sistema di aste online, con particolare attenzione alla sicurezza, all'usabilità e alla manutenibilità del codice. La struttura modulare permette facili estensioni e modifiche future.