const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware cruciali
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
app.use(express.static(path.join(__dirname, 'public')));

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

// Connessione al database usando variabili d'ambiente
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'libro_marketplace'
});

db.connect(err => {
    if (err) {
        console.error('Errore di connessione al database:', err);
        return;
    }
    console.log('Connessione al database riuscita');
});

// Gestione WebSocket (invariata)
io.on('connection', (socket) => {
    console.log('Un utente si è connesso');

    socket.on('joinRoom', ({ libroId, utenteId, venditoreId }) => {
        const room = `libro_${libroId}_user_${utenteId}_venditore_${venditoreId}`;
        socket.join(room);
        console.log(`Utente ${utenteId} è entrato nella stanza ${room}`);
    });

    socket.on('sendMessage', ({ libroId, mittenteId, destinatarioId, messaggio }) => {
        const query = 'INSERT INTO messaggi (libro_id, mittente_id, destinatario_id, messaggio) VALUES (?, ?, ?, ?)';
        db.query(query, [libroId, mittenteId, destinatarioId, messaggio], (err, result) => {
            if (err) {
                console.error("Errore durante l'inserimento del messaggio:", err);
                return;
            }
            const room = `libro_${libroId}_user_${mittenteId}_venditore_${destinatarioId}`;
            io.to(room).emit('receiveMessage', { messaggio, mittenteId });
        });
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
server.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});