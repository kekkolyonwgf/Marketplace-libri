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
        // Se non viene caricata un'immagine, usa l'immagine placeholder
        const immagine = req.file ? 
            `/uploads/${req.file.filename}` : 
            '/uploads/1PLHLD.png';

        await query(
            'INSERT INTO libri (titolo, autore, categoria, prezzo, condizione, descrizione, immagine, venditore_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [titolo, autore, categoria, prezzo, condizione, descrizione, immagine, req.user.id]
        );

        res.status(201).json({ message: 'Libro inserito con successo' });
    } catch (error) {
        console.error('Errore durante inserimento libro:', error);
        res.status(500).json({ message: 'Errore nell\'inserimento del libro' });
    }
});

// Rotta per ottenere libri
router.get('/', authenticateToken, async (req, res) => {
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

// Rotta per ottenere i dettagli di un libro
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const libri = await query('SELECT * FROM libri WHERE id = ?', [id]);
        
        if (libri.length === 0) {
            return res.status(404).json({ message: 'Libro non trovato' });
        }
        
        res.json(libri[0]);
    } catch (error) {
        console.error('Errore nel recupero dei dettagli del libro:', error);
        res.status(500).json({ message: 'Errore nel recupero dei dettagli del libro' });
    }
});

// Rotta per eliminare un libro
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verifica che l'utente sia il proprietario del libro
        const libro = await query('SELECT * FROM libri WHERE id = ? AND venditore_id = ?', [id, req.user.userId]);
        
        if (libro.length === 0) {
            return res.status(403).json({ message: 'Non hai i permessi per eliminare questo libro' });
        }
        
        await query('DELETE FROM libri WHERE id = ?', [id]);
        res.json({ message: 'Libro eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione del libro:', error);
        res.status(500).json({ message: 'Errore durante l\'eliminazione del libro' });
    }
});

module.exports = router;