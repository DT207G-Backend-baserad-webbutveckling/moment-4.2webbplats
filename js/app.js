// Hantering av registreringsformulär
document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, mail: email, password })
    });

    const result = await response.json();
    document.getElementById('registerResult').innerText = result.message || 'Registrering misslyckades.';
});

// Hantering av inloggningsformulär
document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.token) {
        // Spara JWT-token i localStorage
        localStorage.setItem('jwtToken', result.token);
        // Omdirigera till den skyddade sidan
        window.location.href = '/protected.html';
    } else {
        document.getElementById('loginResult').innerText = result.error || 'Inloggning misslyckades.';
    }
});
