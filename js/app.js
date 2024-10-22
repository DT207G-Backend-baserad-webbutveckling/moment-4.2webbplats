// KLIENT-SIDA

const API_URL = 'http://localhost:3005';

// Funktion för att kontrollera query-parametrar och visa felmeddelanden
function checkForErrorMessage() {
    const params = new URLSearchParams(window.location.search);
    const errorMessageElement = document.getElementById('error');

    if (errorMessageElement && params.has('error') && params.get('error') === 'unauthorized') {
        errorMessageElement.textContent = 'Du måste vara inloggad för att få åtkomst till den skyddade sidan.';
    }
}

// Funktion för att kontrollera om användaren är inloggad
function checkIfLoggedIn() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // Omdirigera till inloggningssidan med query parameter
        if (!window.location.search.includes('error=unauthorized')) {
            window.location.href = '/login.html?error=unauthorized';
        }
    } else {
        // Om token finns, validera den med servern
        fetch(`${API_URL}/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Token ogiltig');
                }
                return response.json();
            })
            .then(data => {
                const protectedMessageElement = document.getElementById('protectedMessage');
                if (protectedMessageElement) {
                    protectedMessageElement.innerText = `Välkommen, ${data.username}!`;
                }
            })
            .catch(() => {
                localStorage.removeItem('jwtToken');
                if (!window.location.search.includes('error=unauthorized')) {
                    window.location.href = '/login.html?error=unauthorized?';
                }
            });
    }
}

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

// Tema-växling
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

if (window.location.pathname === '/login.html') {
    checkForErrorMessage();
} else if (window.location.pathname === '/protected.html') {
    checkIfLoggedIn();
}