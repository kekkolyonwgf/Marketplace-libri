document.addEventListener('DOMContentLoaded', () => {
    // Controllo autenticazione
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Mostra il nome utente
    const user = JSON.parse(localStorage.getItem('user'));
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

    const listaLibri = document.getElementById('lista-libri');
    const ricercaTitolo = document.getElementById('ricerca-titolo');
    const categoriaFiltro = document.getElementById('categoria-filtro');
    const BASE_URL = 'http://localhost:3000';

    // Funzione per caricare i libri
    async function caricaLibri(filtroTitolo = '', filtroCategoria = '') {
        try {
            const response = await fetch(`${BASE_URL}/books?titolo=${filtroTitolo}&categoria=${filtroCategoria}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore nel caricamento dei libri');
            }

            const libri = await response.json();

            // Pulisci la lista precedente
            listaLibri.innerHTML = '';

            if (libri.length === 0) {
                listaLibri.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>Nessun libro trovato
                        </div>
                    </div>
                `;
                return;
            }

            // Popola la lista con i libri
            libri.forEach(libro => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-sm-6 col-md-4 col-lg-3';
                
                // Gestione immagine
                const immagineUrl = libro.immagine ? 
                    `${BASE_URL}${libro.immagine}` : 
                    `${BASE_URL}/uploads/placeholder.png`;
                
                // Gestione prezzo
                const prezzo = parseFloat(libro.prezzo) || 0;
                
                colDiv.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${immagineUrl}" 
                             class="card-img-top" 
                             alt="Copertina ${libro.titolo}"
                             style="height: 200px; object-fit: cover;"
                             onerror="this.src='${BASE_URL}/uploads/placeholder.png'">
                        <div class="card-body">
                            <h5 class="card-title text-truncate" title="${libro.titolo}">${libro.titolo}</h5>
                            <p class="card-text mb-1">
                                <i class="fas fa-user me-1 text-primary"></i>
                                <small>${libro.autore}</small>
                            </p>
                            <p class="card-text mb-2">
                                <i class="fas fa-tag me-1 text-primary"></i>
                                <small>${libro.categoria}</small>
                            </p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="h5 mb-0 text-primary">€${prezzo.toFixed(2)}</span>
                                <button class="btn btn-primary btn-sm" onclick="dettaglioLibro(${libro.id})">
                                    <i class="fas fa-info-circle me-1"></i>Dettagli
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                listaLibri.appendChild(colDiv);
            });
        } catch (error) {
            console.error('Errore nel caricamento libri:', error);
            listaLibri.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Errore nel caricamento dei libri. Riprova.
                    </div>
                </div>
            `;
        }
    }

    // Carica libri all'inizializzazione
    caricaLibri();

    // Gestione filtri con debounce per la ricerca
    let timeoutId;
    ricercaTitolo.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            caricaLibri(ricercaTitolo.value, categoriaFiltro.value);
        }, 300);
    });

    categoriaFiltro.addEventListener('change', () => {
        caricaLibri(ricercaTitolo.value, categoriaFiltro.value);
    });

    // Funzione dettaglio libro
    window.dettaglioLibro = (idLibro) => {
        window.location.href = `dettaglio-libro.html?id=${idLibro}`;
    };
});