document.getElementById('login-form').addEventListener('submit', async function(e){
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        // Try to parse JSON; if it fails, read text and surface status
        let data = null;
        try {
            data = await response.json();
        } catch (parseErr) {
            const text = await response.text();
            console.error('Non-JSON response from login.php', response.status, text);
            alert('Server returned an unexpected response (status ' + response.status + ').\nCheck server logs for details.');
            return;
        }

        if (data && data.success) {
            // Save remember-email if requested
            if (remember) {
                localStorage.setItem('remember-email', email);
            } else {
                localStorage.removeItem('remember-email');
            }

            // Persist logged-in user info so other pages can hide login/signup
            if (data.user) {
                try {
                    localStorage.setItem('securemat_user', JSON.stringify(data.user));
                } catch (e) {
                    console.warn('Could not save user to localStorage', e);
                }
            } else {
                // fallback: store at least the email
                localStorage.setItem('securemat_user', JSON.stringify({ email }));
            }

            alert('Login successful!');
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed: ' + (data && data.message ? data.message : 'Unknown error'));
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Network error: ' + error.message);
    }
});

// Pre-fill email if user previously selected "Remember me"
window.addEventListener('DOMContentLoaded', function(){
    const savedEmail = localStorage.getItem('remember-email');
    if(savedEmail){
        document.getElementById('email').value = savedEmail;
        document.getElementById('remember').checked = true;
    }
});