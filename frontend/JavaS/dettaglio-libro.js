document.addEventListener('DOMContentLoaded', () => {
    const libroDettaglio = document.getElementById('libro-dettaglio');
    const chatBox = document.getElementById('chat-box');
    const formChat = document.getElementById('form-chat');
    const inputMessaggio = document.getElementById('messaggio-chat');

    // Recupera l'ID del libro dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const idLibro = urlParams.get('id');
    const utenteId = localStorage.getItem('utenteId'); // Supponendo che l'utente sia autenticato
    const venditoreId = localStorage.getItem('venditoreId'); // Da impostare nel caricamento del libro

    const socket = io(); // Connessione al server WebSocket

    // Funzione per caricare i dettagli del libro
    async function caricaDettagliLibro() {
        try {
            const response = await fetch(`/libri/${idLibro}`);
            const libro = await response.json();

            venditoreId = libro.venditore_id; // Assegna il venditore del libro

            // Popola i dettagli del libro
            libroDettaglio.innerHTML = `
                <div class="dettagli-container">
                    <div class="immagine-libro">
                        <img src="${libro.immagine}" alt="Copertina ${libro.titolo}">
                    </div>
                    <div class="info-libro">
                        <h1>${libro.titolo}</h1>
                        <p><strong>Autore:</strong> ${libro.autore}</p>
                        <p><strong>Categoria:</strong> ${libro.categoria}</p>
                        <p><strong>Prezzo:</strong> €${libro.prezzo.toFixed(2)}</p>
                        <p><strong>Condizione:</strong> ${libro.condizione}</p>
                        <div class="descrizione-libro">
                            <h3>Descrizione</h3>
                            <p>${libro.descrizione}</p>
                        </div>
                    </div>
                </div>
            `;

            // Una volta caricato il libro, unisciti alla chat con il venditore
            socket.emit('joinRoom', { libroId: idLibro, utenteId, venditoreId });

            // Carica la cronologia della chat
            caricaMessaggi();
        } catch (error) {
            console.error('Errore nel caricamento dei dettagli:', error);
            libroDettaglio.innerHTML = '<p>Impossibile caricare i dettagli del libro</p>';
        }
    }

    // Funzione per caricare i messaggi della chat
    async function caricaMessaggi() {
        try {
            const response = await fetch(`/messaggi/${idLibro}/${utenteId}/${venditoreId}`);
            const messaggi = await response.json();

            chatBox.innerHTML = ''; // Pulisce la chat prima di caricare i messaggi

            messaggi.forEach(messaggio => {
                const classeMessaggio = messaggio.mittente_id === utenteId ? 'messaggio-utente' : 'messaggio-venditore';
                chatBox.innerHTML += `<div class="${classeMessaggio}"><strong>${messaggio.mittente_id === utenteId ? 'Tu' : 'Venditore'}:</strong> ${messaggio.messaggio}</div>`;
            });

            chatBox.scrollTop = chatBox.scrollHeight; // Scorri in basso per vedere gli ultimi messaggi
        } catch (error) {
            console.error('Errore nel caricamento dei messaggi:', error);
        }
    }

    // Invio di un messaggio
    formChat.addEventListener('submit', (e) => {
        e.preventDefault();
        const messaggio = inputMessaggio.value.trim();
        if (!messaggio) return;

        // Invia il messaggio al server tramite WebSocket
        socket.emit('sendMessage', {
            libroId: idLibro,
            mittenteId: utenteId,
            destinatarioId: venditoreId,
            messaggio
        });

        // Aggiungi il messaggio alla chat immediatamente
        chatBox.innerHTML += `<div class="messaggio-utente"><strong>Tu:</strong> ${messaggio}</div>`;
        inputMessaggio.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Ricezione dei messaggi in tempo reale
    socket.on('receiveMessage', ({ messaggio, mittenteId }) => {
        const classeMessaggio = mittenteId === utenteId ? 'messaggio-utente' : 'messaggio-venditore';
        chatBox.innerHTML += `<div class="${classeMessaggio}"><strong>${mittenteId === utenteId ? 'Tu' : 'Venditore'}:</strong> ${messaggio}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Carica i dettagli del libro all'avvio della pagina
    caricaDettagliLibro();
});
