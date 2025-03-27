const mysql = require('mysql2');
require('dotenv').config();

// Configurazione della connessione al database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'libro_marketplace',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
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