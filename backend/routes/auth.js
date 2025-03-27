const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database');
const router = express.Router();



router.post('/register', async (req, res) => {
    console.log('Richiesta di registrazione ricevuta:', req.body);
    
    try {
        const { nome, cognome, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
await query('INSERT INTO utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)', 
    [nome, cognome, email, hashedPassword]);
res.status(201).json({ message: 'Registrazione completata!' });
        
        // Validazioni aggiuntive
        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ 
                message: 'Tutti i campi sono obbligatori',
                details: {
                    nome: !!nome,
                    cognome: !!cognome,
                    email: !!email,
                    password: !!password
                }
            });
        }

        // Resto del codice invariato...
    } catch (error) {
        console.error('Errore dettagliato durante la registrazione:', error);
        res.status(500).json({ 
            message: 'Errore durante la registrazione', 
            errorDetails: error.message 
        });
    }
});

// Rotta Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        

        // Trova utente
        const users = await query('SELECT * FROM utenti WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Credenziali non valide' });
        }

        const user = users[0];

        // Verifica password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Credenziali non valide' });
        }

        // Genera token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                nome: user.nome, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il login' });
    }
});

module.exports = router;