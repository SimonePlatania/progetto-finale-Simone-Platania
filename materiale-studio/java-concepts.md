# Concetti Base Java - Note di Studio Aggiornate

## 0. Fondamenti di Java
- **Definizione**: Linguaggio di programmazione orientato agli oggetti che segue i principi di ereditarietà, polimorfismo, astrazione e incapsulamento
- **Caratteristiche Chiave**:
  - Fortemente tipizzato: ogni variabile deve avere un tipo specifico dichiarato
  - Portabile: Write Once, Run Anywhere grazie alla JVM
  - Architettura a livelli: JDK (sviluppo) → JRE (runtime) → JVM (esecuzione)
- **Processo di Esecuzione**:
  - Codice Java (.java) → Bytecode (.class) → Linguaggio macchina
  - Il bytecode è un formato intermedio interpretabile dalla JVM
  - La JVM traduce il bytecode in istruzioni specifiche per ogni sistema operativo

## 1. Variabili e Tipi
- **Definizione**: Una variabile è una struttura dati che contiene un valore
- **Tipizzazione**: Java è fortemente tipizzato - il tipo deve essere specificato e rispettato
- **Tipi di Variabili**:
  - Primitive: contenute nello stack (es. int, boolean)
  - Reference/Oggetti: riferimenti a oggetti nell'heap
  - Wrapper: oggetti che incapsulano tipi primitivi (utili per null e metodi)
- **Gestione della Memoria**:
  - Stack: variabili primitive e riferimenti
  - Heap: oggetti e String Pool
  - Passaggio parametri: per valore per primitivi, per riferimento per oggetti

## 2. Modificatori di Accesso
- **private**: accessibile solo all'interno della stessa classe
- **protected**: accessibile nella classe, sottoclassi e stesso package
- **public**: accessibile ovunque
- **default**: accessibile solo nello stesso package

## 3. Cicli
- **for**: quando si conosce il numero di iterazioni
- **while**: esegue finché una condizione è vera (verifica prima)
- **do-while**: esegue almeno una volta, poi verifica la condizione
- **foreach**: itera su tutti gli elementi di una collezione

## 4. Collezioni
### Array
- Dimensione fissa
- Tipo singolo (omogeneo)
- Performance migliore per dimensioni fisse
- Esempio: `int[] mensilita = new int[12]`

### ArrayList
- Dimensione dinamica
- Richiede generics per type safety
- Più flessibile ma con overhead
- Esempio: `ArrayList<String> nomi = new ArrayList<>();`

### HashMap
- Struttura chiave-valore per accesso rapido
- Utilizza hashCode per organizzare i dati
- Non permette chiavi duplicate
- Performance O(1) per accesso
- Esempio: `HashMap<String, Integer> eta = new HashMap<>();`

### HashSet
- Collezione che non permette duplicati
- Non mantiene ordine di inserimento
- Usa hashCode/equals per unicità
- Efficiente per verifica appartenenza
- Esempio: `HashSet<String> codici = new HashSet<>();`

## 5. Gestione Eccezioni
- **Gerarchia**: Throwable → Error/Exception
- **Tipi**:
  - Checked: verificate a compile-time
  - Unchecked: errori runtime
- **Gestione**:
  - try-catch per gestione locale
  - throws per propagazione
  - finally per pulizia risorse
  - try-with-resources per gestione automatica risorse

## Best Practices
- Preferire ArrayList per collezioni dinamiche
- Usare HashMap per ricerche veloci
- Implementare correttamente hashCode/equals
- Gestire appropriatamente le eccezioni
- Utilizzare i modificatori di accesso per incapsulamento
- Sfruttare il type safety di Java