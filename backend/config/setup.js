const fs = require('fs');
const path = require('path');

// Funzione per copiare l'immagine placeholder se non esiste
function setupPlaceholderImage() {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    const placeholderDest = path.join(uploadsDir, '1PLHLD.png');

    // Se l'immagine placeholder non esiste nella cartella uploads
    if (!fs.existsSync(placeholderDest)) {
        // Crea la cartella uploads se non esiste
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Copia l'immagine placeholder dalla cartella assets
        const placeholderSrc = path.join(__dirname, '..', 'assets', '1PLHLD.png');
        if (fs.existsSync(placeholderSrc)) {
            fs.copyFileSync(placeholderSrc, placeholderDest);
            console.log('✓ Immagine placeholder copiata con successo');
        } else {
            console.error('✗ Immagine placeholder non trovata nella cartella assets');
        }
    }
}

module.exports = {
    setupPlaceholderImage
}; 