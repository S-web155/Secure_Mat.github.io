// Protect dashboard and show user info; handle logout.
window.addEventListener('DOMContentLoaded', function () {
    const stored = localStorage.getItem('securemat_user');
    if (!stored) {
        // Not logged in — redirect to login
        window.location.href = 'login.html';
        return;
    }

    let user;
    try {
        user = JSON.parse(stored);
    } catch (e) {
        console.warn('Invalid user data in localStorage, clearing and redirecting.', e);
        localStorage.removeItem('securemat_user');
        window.location.href = 'login.html';
        return;
    }

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const welcomeHeading = document.getElementById('welcome-heading');
    const welcomeMsg = document.getElementById('welcome-message');
    const createdEl = document.getElementById('user-created');

    nameEl.textContent = user.first_name || user.email || 'User';
    emailEl.textContent = user.email || '—';
    welcomeHeading.textContent = `Welcome, ${user.first_name || user.email || 'User'}`;
    welcomeMsg.textContent = user.first_name ? `Glad to see you back, ${user.first_name}.` : '';
    createdEl.textContent = user.created_at ? new Date(user.created_at).toLocaleDateString() : '—';
});

// logout button
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'logout-btn') {
        localStorage.removeItem('securemat_user');
        // optionally remove remember-email if you want
        // localStorage.removeItem('remember-email');
        window.location.href = 'index.html';
    }
});