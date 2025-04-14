# Marketplace di Libri

Un'applicazione web per la compravendita di libri usati, sviluppata con Node.js, Express e MySQL.

## 🚀 Funzionalità

- **Autenticazione Utenti**
  - Registrazione nuovi utenti
  - Login con email e password
  - Gestione sessione utente

- **Gestione Libri**
  - Pubblicazione nuovi libri
  - Visualizzazione catalogo libri
  - Ricerca e filtri per titolo e categoria
  - Dettagli completi dei libri
  - Modifica ed eliminazione libri pubblicati

- **Sistema di Messaggistica**
  - Chat in tempo reale tra acquirenti e venditori
  - Storico messaggi
  - Notifiche di nuovi messaggi

- **Interfaccia Utente**
  - Design responsive con Bootstrap 5
  - Tema caldo e accogliente
  - Gestione immagini con preview
  - Feedback visivi per le azioni utente

## 🛠️ Tecnologie Utilizzate

### Backend
- Node.js
- Express.js
- MySQL
- JWT per l'autenticazione
- Multer per la gestione dei file
- Socket.io per la chat in tempo reale

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.2
- Font Awesome 6.0.0

## 📁 Struttura del Progetto

```
MarketPlace/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── messageController.js
│   ├── models/
│   │   ├── user.js
│   │   ├── book.js
│   │   └── message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── messages.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── HTML/
│   │   ├── login.html
│   │   ├── registrazione.html
│   │   ├── home.html
│   │   ├── vendi-libro.html
│   │   ├── dettaglio-libro.html
│   │   └── modifica-libro.html
│   ├── JavaS/
│   │   ├── login.js
│   │   ├── registrazione.js
│   │   ├── home.js
│   │   ├── vendi-libro.js
│   │   ├── dettaglio-libro.js
│   │   └── modifica-libro.js
│   └── CSS/
│       └── style.css
└── README.md
```

## 🚀 Installazione e Avvio

1. **Configurazione Database**
   ```sql
   CREATE DATABASE marketplace;
   USE marketplace;
   ```

2. **Creazione Tabelle**
   ```sql
   -- Tabella Utenti
   CREATE TABLE utenti (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nome VARCHAR(50) NOT NULL,
       cognome VARCHAR(50) NOT NULL,
       email VARCHAR(100) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Tabella Libri
   CREATE TABLE libri (
       id INT AUTO_INCREMENT PRIMARY KEY,
       titolo VARCHAR(100) NOT NULL,
       autore VARCHAR(100) NOT NULL,
       categoria VARCHAR(50) NOT NULL,
       descrizione TEXT,
       prezzo DECIMAL(10,2) NOT NULL,
       condizione VARCHAR(50),
       immagine VARCHAR(255),
       venditore_id INT NOT NULL,
       data_pubblicazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (venditore_id) REFERENCES utenti(id) 
   );

   -- Tabella Messaggi
   CREATE TABLE messaggi (
       id INT AUTO_INCREMENT PRIMARY KEY,
       libro_id INT NOT NULL,
       mittente_id INT NOT NULL,
       destinatario_id INT NOT NULL,
       messaggio TEXT NOT NULL,
       data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (libro_id) REFERENCES libri(id) ,
       FOREIGN KEY (mittente_id) REFERENCES utenti(id),
       FOREIGN KEY (destinatario_id) REFERENCES utenti(id)
   );
```

3. **Installazione Dipendenze Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Configurazione Variabili d'Ambiente**
   - Creare un file `.env` nella cartella backend con:
     ```
     DB_HOST=localhost
     DB_USER=tuo_utente
     DB_PASSWORD=tua_password
     DB_NAME=marketplace
     JWT_SECRET=tua_chiave_segreta
     ```

5. **Avvio Server**
   ```bash
   npm start
   ```

6. **Avvio Frontend**
   - Apri il file `frontend/HTML/login.html` nel browser

## 🔒 Sicurezza

- Autenticazione basata su JWT
- Validazione input lato server
- Sanitizzazione dei dati
- Protezione contro SQL injection
- Gestione sicura delle password

## 📱 Responsive Design

L'applicazione è completamente responsive e supporta:
- Desktop
- Tablet
- Smartphone

## 🎨 Stile e Design

- Tema caldo con colori accoglienti
- Card con ombreggiatura
- Animazioni fluide
- Icone Font Awesome
- Layout a griglia Bootstrap


## 📝 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👥 Autori

- Kevin Hossain e Gabriele Tarricone - Sviluppatori principali

## 🙏 Ringraziamenti

- Bootstrap per il framework CSS
- Font Awesome per le icone
- Express.js per il framework backend
- MySQL per il database
- IA
