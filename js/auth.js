// auth.js — manage logged-in state UI and authentication checks
document.addEventListener('DOMContentLoaded', function () {
    const userJson = localStorage.getItem('securemat_user');
    
    // If on index.html and user is logged in, redirect to dashboard
    if (userJson && window.location.pathname.includes('index.html')) {
        try {
            const user = JSON.parse(userJson);
            window.location.href = 'dashboard.html';
            return;
        } catch (e) {
            console.error('auth.js: error parsing user data', e);
        }
    }

    const widget = document.querySelector('.login-widget');
    if (!widget) return;

    function renderLoggedOut() {
        widget.innerHTML = `
            <a href="login.html" class="login-link">Login</a>
            <a href="signup.html" class="signup-link">Sign Up</a>
        `;
    }

    function renderLoggedIn(user) {
        const name = (user && (user.name || user.first_name || user.email)) || 'User';
        widget.innerHTML = `
            <div class="user-menu">
                <span class="user-name">Hi, ${escapeHtml(name)}</span>
                <a href="#" class="logout-link">Logout</a>
            </div>
        `;
        const logout = widget.querySelector('.logout-link');
        logout.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('securemat_user');
            renderLoggedOut();
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (m) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[m];
        });
    }

    try {
        if (userJson) {
            const user = JSON.parse(userJson);
            renderLoggedIn(user);
        } else {
            renderLoggedOut();
        }
    } catch (e) {
        console.error('auth.js: error reading user from localStorage', e);
        renderLoggedOut();
    }
});