const mysql = require('mysql2');
require('dotenv').config();

// Configurazione della connessione al database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'libro_marketplace',
    connectionLimit: 10,        // Ridotto per evitare sovraccarichi
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 30000       // 30 secondi timeout connessione
    // Rimosse le opzioni non valide (acquireTimeout e timeout)
});

// Verifica della connessione al database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Errore di connessione al database:', err);
    } else {
        console.log('Connessione al database riuscita');
        connection.release();
    }
});

// Funzione per gestire le query
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
};

module.exports = {
    pool,
    query
};