document.addEventListener('DOMContentLoaded', () => {
    const listaLibri = document.getElementById('lista-libri');
    const ricercaTitolo = document.getElementById('ricerca-titolo');
    const categoriaFiltro = document.getElementById('categoria-filtro');

    // Funzione per caricare i libri
    async function caricaLibri(filtroTitolo = '', filtroCategoria = '') {
        try {
            const response = await fetch(`/libri?titolo=${filtroTitolo}&categoria=${filtroCategoria}`);
            const libri = await response.json();

            // Pulisci la lista precedente
            listaLibri.innerHTML = '';

            // Popola la lista con i libri
            libri.forEach(libro => {
                const divLibro = document.createElement('div');
                divLibro.classList.add('libro-card');
                divLibro.innerHTML = `
                    <img src="${libro.immagine}" alt="Copertina ${libro.titolo}">
                    <h3>${libro.titolo}</h3>
                    <p>Autore: ${libro.autore}</p>
                    <p>Prezzo: €${libro.prezzo.toFixed(2)}</p>
                    <button onclick="dettaglioLibro(${libro.id})">Dettagli</button>
                `;
                listaLibri.appendChild(divLibro);
            });
        } catch (error) {
            console.error('Errore nel caricamento libri:', error);
        }
    }

    // Carica libri all'inizializzazione
    caricaLibri();

    // Gestione filtri
    ricercaTitolo.addEventListener('input', () => {
        caricaLibri(ricercaTitolo.value, categoriaFiltro.value);
    });

    categoriaFiltro.addEventListener('change', () => {
        caricaLibri(ricercaTitolo.value, categoriaFiltro.value);
    });

    // Funzione dettaglio libro (da implementare)
    window.dettaglioLibro = (idLibro) => {
        window.location.href = `/dettaglio-libro.html?id=${idLibro}`;
    };
});