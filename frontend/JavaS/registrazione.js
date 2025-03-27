document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

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
            const response = await fetch('/auth/register', {
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
            
            const result = await response.text(); // Usa text() invece di json()
            console.log('Response body:', result);

            // Prova a parsare manualmente il JSON
            try {
                const jsonResult = JSON.parse(result);
                
                if (response.ok) {
                    alert('Registrazione completata con successo!');
                    window.location.href = '/login.html';
                } else {
                    alert(jsonResult.message || 'Errore durante la registrazione');
                }
            } catch (parseError) {
                console.error('Errore nel parsing JSON:', parseError);
                alert('Errore inaspettato: ' + result);
            }

        } catch (error) {
            console.error('Errore di rete completo:', error);
            alert('Si è verificato un errore di rete. Riprova.');
        }
    });
});