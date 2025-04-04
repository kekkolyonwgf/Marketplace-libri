const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const { query } = require('./database'); // Usa il pool di connessioni esistente
const { setupPlaceholderImage } = require('./config/setup');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Inizializza l'immagine placeholder
setupPlaceholderImage();

// Middleware cruciali
app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501'], // Origini consentite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Parsing del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire file statici
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Log di tutte le richieste (per debug)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Importa le rotte
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

// Usa le rotte
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

// Rotta principale che reindirizza alla home
app.get('/', (req, res) => {
    res.redirect('/home.html');
});

// Gestione WebSocket (modificata per usare il pool di connessioni)
io.on('connection', (socket) => {
    console.log('Un utente si è connesso');

    socket.on('joinRoom', ({ libroId, utenteId, venditoreId }) => {
        const room = `libro_${libroId}_user_${utenteId}_venditore_${venditoreId}`;
        socket.join(room);
        console.log(`Utente ${utenteId} è entrato nella stanza ${room}`);
    });

    socket.on('sendMessage', async ({ libroId, mittenteId, destinatarioId, messaggio }) => {
        try {
            await query(
                'INSERT INTO messaggi (libro_id, mittente_id, destinatario_id, messaggio) VALUES (?, ?, ?, ?)',
                [libroId, mittenteId, destinatarioId, messaggio]
            );
            const room = `libro_${libroId}_user_${mittenteId}_venditore_${destinatarioId}`;
            io.to(room).emit('receiveMessage', { messaggio, mittenteId });
        } catch (err) {
            console.error("Errore durante l'inserimento del messaggio:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utente si è disconnesso');
    });
});

// Gestore errori globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Qualcosa è andato storto!' });
});

// Avvia il server
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));