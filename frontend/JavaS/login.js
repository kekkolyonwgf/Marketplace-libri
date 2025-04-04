document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const BASE_URL = 'http://localhost:3000';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form di login inviato');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Invio richiesta di login a:', `${BASE_URL}/auth/login`);
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            console.log('Status della risposta:', response.status);
            
            // Prima leggiamo il testo della risposta
            const responseText = await response.text();
            console.log('Testo della risposta:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Errore nel parsing della risposta:', parseError);
                throw new Error('Risposta non valida dal server');
            }

            if (response.ok) {
                console.log('Login riuscito, salvataggio token e dati utente');
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                console.log('Reindirizzamento alla home');
                window.location.href = 'home.html';
            } else {
                console.error('Errore di login:', result.message);
                alert(result.message || 'Credenziali non valide');
            }
        } catch (error) {
            console.error('Errore completo:', error);
            alert('Si è verificato un errore. Riprova.');
        }
    });
});