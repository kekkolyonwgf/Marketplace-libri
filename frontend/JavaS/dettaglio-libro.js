document.addEventListener('DOMContentLoaded', () => {
    const libroDettaglio = document.getElementById('libro-dettaglio');
    const chatBox = document.getElementById('chat-box');
    const formChat = document.getElementById('form-chat');
    const inputMessaggio = document.getElementById('messaggio-chat');
    const BASE_URL = 'http://localhost:3000';

    // Recupera l'ID del libro dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const idLibro = urlParams.get('id');
    
    // Recupera il token e i dati utente
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
        window.location.href = 'login.html';
        return;
    }

    // Mostra il nome utente nella navbar
    const usernameElement = document.getElementById('username');
    if (user && user.nome) {
        usernameElement.textContent = `${user.nome} ${user.cognome}`;
    }

    // Gestione logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    let libroCorrente = null;

    // Funzione per caricare i dettagli del libro
    async function caricaDettagliLibro() {
        try {
            const response = await fetch(`${BASE_URL}/books/dettaglio/${idLibro}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore nel caricamento del libro');
            }

            const libro = await response.json();
            console.log('Dettagli libro:', libro);
            libroCorrente = libro;

            // Popola i dettagli del libro
            libroDettaglio.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="position-relative mb-3">
                                <img src="${libro.immagine ? `${BASE_URL}${libro.immagine}` : `${BASE_URL}/uploads/placeholder.png`}" 
                                     class="img-fluid rounded shadow-sm" 
                                     alt="Copertina ${libro.titolo}"
                                     onerror="this.src='${BASE_URL}/uploads/placeholder.png'">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h2 class="mb-3">${libro.titolo}</h2>
                            <div class="mb-4">
                                <p class="mb-2">
                                    <i class="fas fa-user me-2 text-primary"></i>
                                    <strong>Autore:</strong> ${libro.autore}
                                </p>
                                <p class="mb-2">
                                    <i class="fas fa-tag me-2 text-primary"></i>
                                    <strong>Categoria:</strong> ${libro.categoria}
                                </p>
                                <p class="mb-2">
                                    <i class="fas fa-euro-sign me-2 text-primary"></i>
                                    <strong>Prezzo:</strong> €${parseFloat(libro.prezzo).toFixed(2)}
                                </p>
                                <p class="mb-2">
                                    <i class="fas fa-info-circle me-2 text-primary"></i>
                                    <strong>Condizione:</strong> ${libro.condizione || 'Non specificata'}
                                </p>
                            </div>
                            <div class="card bg-light">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <i class="fas fa-file-alt me-2 text-primary"></i>
                                        Descrizione
                                    </h5>
                                    <p class="card-text">${libro.descrizione || 'Nessuna descrizione disponibile'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Se l'utente è il venditore, mostra opzioni di modifica
            if (user.id === libro.venditore_id) {
                const opzioniVenditore = document.createElement('div');
                opzioniVenditore.className = 'card-footer bg-light';
                opzioniVenditore.innerHTML = `
                    <div class="d-flex justify-content-end gap-2">
                        <button class="btn btn-primary" onclick="modificaLibro(${libro.id})">
                            <i class="fas fa-edit me-1"></i>Modifica
                        </button>
                        <button class="btn btn-danger" onclick="eliminaLibro(${libro.id})">
                            <i class="fas fa-trash-alt me-1"></i>Elimina
                        </button>
                    </div>
                `;
                libroDettaglio.appendChild(opzioniVenditore);
            }

            // Inizializza la chat solo se l'utente non è il venditore
            if (user.id !== libro.venditore_id) {
                initChat(libro.venditore_id);
            } else {
                document.querySelector('.contatta-venditore').style.display = 'none';
            }
        } catch (error) {
            console.error('Errore nel caricamento dei dettagli:', error);
            libroDettaglio.innerHTML = `
                <div class="card-body text-center">
                    <i class="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
                    <p class="text-danger">Impossibile caricare i dettagli del libro</p>
                </div>
            `;
        }
    }

    // Funzione per inizializzare la chat
    function initChat(venditoreId) {
        caricaMessaggi(venditoreId);

        formChat.onsubmit = async (e) => {
            e.preventDefault();
            const messaggio = inputMessaggio.value.trim();
            if (!messaggio) return;

            const btnSubmit = formChat.querySelector('button[type="submit"]');
            btnSubmit.disabled = true;

            try {
                const response = await fetch(`${BASE_URL}/messages/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        libro_id: idLibro,
                        destinatario_id: venditoreId,
                        messaggio: messaggio
                    })
                });

                if (response.ok) {
                    chatBox.innerHTML += `
                        <div class="message-bubble outgoing fade-in">
                            <div class="message-content">
                                <strong>Tu:</strong> ${messaggio}
                            </div>
                            <small class="text-muted">${new Date().toLocaleTimeString()}</small>
                        </div>
                    `;
                    inputMessaggio.value = '';
                    chatBox.scrollTop = chatBox.scrollHeight;
                }
            } catch (error) {
                console.error('Errore nell\'invio del messaggio:', error);
                alert('Errore nell\'invio del messaggio');
            } finally {
                btnSubmit.disabled = false;
            }
        };
    }

    // Funzione per caricare i messaggi della chat
    async function caricaMessaggi(venditoreId) {
        try {
            const response = await fetch(`${BASE_URL}/messages/${idLibro}/${venditoreId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore nel caricamento dei messaggi');
            }

            const messaggi = await response.json();
            chatBox.innerHTML = '';

            messaggi.forEach(msg => {
                const isMioMessaggio = msg.mittente_id === user.id;
                chatBox.innerHTML += `
                    <div class="message-bubble ${isMioMessaggio ? 'outgoing' : 'incoming'} mb-2">
                        <div class="message-content">
                            <strong>${isMioMessaggio ? 'Tu' : 'Venditore'}:</strong> ${msg.messaggio}
                        </div>
                        <small class="text-muted">${new Date(msg.data_invio).toLocaleString()}</small>
                    </div>
                `;
            });

            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error('Errore nel caricamento dei messaggi:', error);
            chatBox.innerHTML = `
                <div class="text-center text-danger p-3">
                    <i class="fas fa-exclamation-circle mb-2"></i>
                    <p>Impossibile caricare i messaggi</p>
                </div>
            `;
        }
    }

    window.modificaLibro = (id) => {
        window.location.href = `modifica-libro.html?id=${id}`;
    };

    window.eliminaLibro = async (id) => {
        if (!confirm('Sei sicuro di voler eliminare questo libro?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Libro eliminato con successo');
                window.location.href = 'home.html';
            } else {
                throw new Error('Errore nell\'eliminazione del libro');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante l\'eliminazione del libro');
        }
    };

    caricaDettagliLibro();
});
