# Marketplace di Scambio Libri Usati - Web Application Multitier (By Tarricone Gabriele & Kevin Hossain)

## 1. Specifiche dell'Applicazione
**Descrizione**:  
Applicazione web per lo scambio di libri usati tra utenti, con funzionalità di pubblicazione annunci, ricerca, e chat integrata.

**Stack Tecnologico**:
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla o framework come React/Vue.js se usato)
- **Backend**: Node.js con Express.js
- **Database**: MySQL
- **Altro**: Multer per upload immagini, Socket.io per chat (se implementata)

**Funzionalità Principali**:
- Registrazione e autenticazione utente (JWT o sessioni)
- Pubblicazione annunci con titolo, descrizione, prezzo, immagini e categorie
- Ricerca annunci con filtri (per autore, categoria, prezzo, ecc.)
- Sistema di messaggistica tra utenti per trattative
- Dashboard utente per gestione annunci e messaggi

## 2. Struttura del Database (Schema ER)--------------------------------------------------------------------------------------------------------
Ecco le tabelle principali (costruite e importate da xampp usando phpmyadmin:

```sql
-- Utenti
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Annunci
CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    image_path VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Messaggi
CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    book_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);
```

3. API REST Implementate-------------------------------------------------------------------------------------------------------------------
Elenco degli endpoint principali:

Autenticazione
POST /api/auth/register - Registrazione utente

POST /api/auth/login - Login utente

Libri
GET /api/books - Lista tutti i libri (con filtri opzionali)

POST /api/books - Crea nuovo annuncio (protetto)

GET /api/books/:id - Dettagli libro specifico

DELETE /api/books/:id - Elimina annuncio (protetto)

Messaggi
POST /api/messages - Invia messaggio (protetto)

GET /api/messages/:book_id - Lista messaggi per annuncio (protetto)

4. Istruzioni cURL per Test API ----------------------------------------------------------------------------------------------------------
Registrazione Utente
```
curl -X POST http://localhost:3000/api/auth/register 
-H "Content-Type: application/json" 
-d '{
      "nomi":"mario"   
      "cognome":"rossi",
      "email":"mario@example.com", 
      "password":"password123"
    }'
```
Login:
```
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" 
-d '{
      "email":"mario@example.com", 
      "password":"password123"
    }'
```
-------------------------------------------------------------------------------------------------------------------------------------------
```
curl -X POST http://localhost:3000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TUO_TOKEN_JWT>" \
-d '{
    "title":"Il Signore degli Anelli"
    "author":"J.R.R. Tolkien", 
    "price":15.50, 
    "description":"Edizione 2001"
    }'
```    
5. Test Eseguiti----------------------------------------------------------------------------------------------------------------------------
Registrazione utente: Verifica creazione account e errori (email già usata)

Login: Test autenticazione con credenziali corrette/errate

Pubblicazione annuncio: Controllo upload immagini e campi obbligatori

Messaggistica (da implementare)

Ricerca con filtri (da implementare)
#######################################################################################################

Istruzioni per Avviare il Progetto:

Clona il repo: git clone <url_repo>

Installa dipendenze: npm install

Configura .env con credenziali DB e JWT secret

Avvia backend: node server.js

Apri index.html nel browser per il frontend
---------------------------------------------------------------------------------------------------------------------------------------------

