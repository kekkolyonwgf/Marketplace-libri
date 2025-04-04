document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const BASE_URL = 'http://localhost:3000';
    const FRONTEND_URL = 'http://localhost:5501/frontend';

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const cognome = document.getElementById('cognome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confermaPassword = document.getElementById('conferma-password').value;

        // Validazione base
        if (password !== confermaPassword) {
            alert('Le password non corrispondono');
            return;
        }

        // Log dei dati da inviare
        console.log('Dati di registrazione:', {
            nome,
            cognome,
            email,
            passwordLength: password.length
        });

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    cognome,
                    email,
                    password
                })
            });

            // Log dettagliato della risposta
            console.log('Response status:', response.status);
            
            const result = await response.text();
            console.log('Response body:', result);

            let jsonResult;
            try {
                jsonResult = JSON.parse(result);
            } catch (parseError) {
                console.error('Errore nel parsing JSON:', parseError);
                throw new Error('Risposta non valida dal server');
            }

            if (response.ok) {
                alert('Registrazione completata con successo!');
                window.location.href = `${FRONTEND_URL}/login.html`;
            } else {
                alert(jsonResult.message || 'Errore durante la registrazione');
            }

        } catch (error) {
            console.error('Errore di rete:', error);
            alert('Si è verificato un errore di rete. Riprova.');
        }
    });
});