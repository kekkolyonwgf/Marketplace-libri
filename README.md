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

2. **Installazione Dipendenze Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configurazione Variabili d'Ambiente**
   - Creare un file `.env` nella cartella backend con:
     ```
     DB_HOST=localhost
     DB_USER=tuo_utente
     DB_PASSWORD=tua_password
     DB_NAME=marketplace
     JWT_SECRET=tua_chiave_segreta
     ```

4. **Avvio Server**
   ```bash
   npm start
   ```

5. **Avvio Frontend**
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

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 👥 Autori

- [Il Tuo Nome] - Sviluppatore principale

## 🙏 Ringraziamenti

- Bootstrap per il framework CSS
- Font Awesome per le icone
- Express.js per il framework backend
- MySQL per il database 
