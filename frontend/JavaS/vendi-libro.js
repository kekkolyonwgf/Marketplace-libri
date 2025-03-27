document.addEventListener('DOMContentLoaded', () => {
    const formVendiLibro = document.getElementById('form-vendi-libro');

    formVendiLibro.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Controllo token di autenticazione
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Effettua il login per pubblicare un libro');
            window.location.href = '/login.html';
            return;
        }

        // Preparazione dati
        const formData = new FormData(formVendiLibro);

        try {
            const response = await fetch('/inserisci-libro', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Libro pubblicato con successo!');
                window.location.href = '/home.html';
            } else {
                alert(result.message || 'Errore nella pubblicazione del libro');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Si è verificato un errore. Riprova.');
        }
    });
});