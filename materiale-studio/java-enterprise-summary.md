# Panoramica Java Enterprise: Dalle Servlet ai Framework Moderni

## 1. Evoluzione delle Tecnologie Web Java

### 1.1 Servlet
- **Definizione**: Componenti lato server che estendono HttpServlet
- **Scopo**: Gestione delle richieste HTTP e generazione delle risposte
- **Ciclo di Vita**:
  1. Inizializzazione (`init()`)
  2. Gestione richieste (`doGet()`, `doPost()`, etc.)
  3. Distruzione (`destroy()`)
- **Caratteristiche**:
  - Gestite dal container dell'application server
  - Combinano logica di business e presentazione
  - Richiedono gestione manuale delle risorse
  - Rappresentano i "precursori" dei moderni controller

### 1.2 JSP (JavaServer Pages)
- **Definizione**: Tecnologia per creare pagine web dinamiche
- **Caratteristiche**:
  - Combina HTML e codice Java
  - Rendering lato server
  - Sintassi speciale per incorporare codice Java: `<% ... %>`
- **Motivazione Storica**:
  - Browser con capacità limitate
  - Necessità di generare contenuto dinamico
  - Limitazioni di JavaScript dell'epoca

## 2. Pattern DAO e Accesso ai Dati

### 2.1 JDBC (Java Database Connectivity)
- **Definizione**: API di basso livello per accesso al database
- **Componenti**:
  - Driver specifici per database (es. MySQL Connector/J)
  - Connection management
  - Statement e PreparedStatement
- **Caratteristiche**:
  - Gestione manuale delle connessioni
  - Necessità di chiusura esplicita delle risorse
  - Utilizzo di PreparedStatement per prevenire SQL Injection

### 2.2 Pattern DAO
- **Struttura**:
  ```
  Client -> Controller -> DAO -> Mapper -> Database
  ```
- **Vantaggi**:
  - Separazione delle responsabilità
  - Migliore organizzazione del codice
  - Facilità di manutenzione
  - Astrazione dell'accesso ai dati

## 3. MyBatis

### 3.1 Caratteristiche Principali
- Framework "non completamente ORM"
- Utilizzo di mapper per le query SQL
- Configurazione tramite XML o annotazioni
- Maggior controllo sulle query SQL

### 3.2 Configurazione
- File mybatis-config.xml per setup database
- Mapper XML o annotazioni per definire le query
- Possibilità di utilizzare pattern DAO

### 3.3 Vantaggi
- Controllo granulare sulle query
- Performance ottimizzate
- Mapping diretto SQL-oggetti
- Flessibilità nella gestione delle query complesse

## 4. Considerazioni Architetturali

### 4.1 Evoluzione delle Architetture
- Da monolitico (Servlet) a stratificato (MVC)
- Separazione progressiva delle responsabilità
- Introduzione di pattern architetturali

### 4.2 Best Practices
- Separazione delle responsabilità
- Gestione appropriata delle risorse
- Utilizzo di pattern di progettazione
- Sicurezza (PreparedStatement, validazione input)

## 5. Confronto con le Tecnologie Moderne

### 5.1 Da JSP a Framework Moderni
- Evoluzione verso rendering lato client
- Maggiore separazione tra frontend e backend
- Utilizzo di API RESTful
- Gestione automatizzata delle risorse

### 5.2 Da XML a Annotazioni
- Semplificazione della configurazione
- Maggiore leggibilità del codice
- Migliore supporto degli IDE
- Manutenzione più agevole

## Conclusioni
L'evoluzione delle tecnologie Java Enterprise mostra un chiaro percorso verso:
- Maggiore modularità
- Migliore separazione delle responsabilità
- Automazione della gestione delle risorse
- Semplificazione dello sviluppo
- Maggiore manutenibilità del codice

Questa evoluzione continua a influenzare il modo in cui progettiamo e sviluppiamo applicazioni enterprise moderne, mantenendo i principi fondamentali mentre si adattano alle nuove esigenze e tecnologie.