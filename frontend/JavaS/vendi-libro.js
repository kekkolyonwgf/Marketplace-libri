document.addEventListener('DOMContentLoaded', () => {
    const formVendiLibro = document.getElementById('form-vendi-libro');
    const BASE_URL = 'http://localhost:3000';

    // Controllo token di autenticazione
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

    formVendiLibro.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Preparazione dati
        const formData = new FormData(formVendiLibro);

        try {
            const response = await fetch(`${BASE_URL}/books/inserisci-libro`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Non impostiamo Content-Type per FormData, il browser lo farà automaticamente
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Errore risposta:', errorText);
                throw new Error('Errore nella pubblicazione del libro');
            }

            const result = await response.json();

            alert('Libro pubblicato con successo!');
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Errore:', error);
            alert('Si è verificato un errore. Riprova.');
        }
    });
});