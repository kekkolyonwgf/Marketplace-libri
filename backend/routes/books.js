const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // Aggiungi questa riga
const { query } = require('../database');
const router = express.Router();

// Configurazione upload immagini
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware di autenticazione
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rotta per inserimento libro
router.post('/inserisci-libro', authenticateToken, upload.single('immagine'), async (req, res) => {
    try {
        const { titolo, autore, categoria, prezzo, condizione, descrizione } = req.body;
        const immagine = req.file ? `/uploads/${req.file.filename}` : null;

        await query(
            'INSERT INTO libri (titolo, autore, categoria, prezzo, condizione, descrizione, immagine, venditore_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [titolo, autore, categoria, prezzo, condizione, descrizione, immagine, req.user.id]
        );

        res.status(201).json({ message: 'Libro inserito con successo' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nell\'inserimento del libro' });
    }
});

// Rotta per ottenere libri
router.get('/', async (req, res) => {
    try {
        const { titolo, categoria } = req.query;
        
        let query_string = 'SELECT * FROM libri WHERE 1=1';
        let params = [];

        if (titolo) {
            query_string += ' AND titolo LIKE ?';
            params.push(`%${titolo}%`);
        }

        if (categoria) {
            query_string += ' AND categoria = ?';
            params.push(categoria);
        }

        const libri = await query(query_string, params);
        res.json(libri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero dei libri' });
    }
});

// Aggiungi questa rotta in books.js
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const libri = await query('SELECT * FROM libri WHERE id = ?', [id]);
        
        if (libri.length === 0) {
            return res.status(404).json({ message: 'Libro non trovato' });
        }
        
        res.json(libri[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero dei dettagli del libro' });
    }
});

module.exports = router;