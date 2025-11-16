// filepath: s:\projects\c++\securemat-site\anti-theft-mat-site\js\main.js
// This file is intentionally left blank.

(function(){
    const STORAGE_KEY = 'site-theme';
    const btn = document.getElementById('theme-toggle');

    function applyTheme(theme){
        document.documentElement.setAttribute('data-theme', theme);
        if(btn){
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-pressed', theme === 'dark');
        }
    }

    function getPreferredTheme(){
        const saved = localStorage.getItem(STORAGE_KEY);
        if(saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function toggleTheme(){
        const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
    }

    // init
    applyTheme(getPreferredTheme());

    if(btn){
        btn.addEventListener('click', toggleTheme);
    }

    // respond to OS-level changes if user hasn't chosen explicitly
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', e => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if(!saved){
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
})();