function applyMode(isDarkMode) {
    const toggle = document.getElementById('dark-mode-toggle');

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (toggle) { // VERIFICAÇÃO ADICIONADA AQUI
            toggle.checked = true; // Sincroniza o switch
        }
        localStorage.setItem('mode', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        if (toggle) { // VERIFICAÇÃO ADICIONADA AQUI
            toggle.checked = false; // Sincroniza o switch
        }
        localStorage.setItem('mode', 'light');
    }
}

// ... Lógica de inicialização (mantém a chamada applyMode(isDarkMode) normal) ...
const savedMode = localStorage.getItem('mode');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedMode === 'dark' || (!savedMode && prefersDark)) {
    applyMode(true);
} else {
    applyMode(false);
}

// Listener para a mudança manual (garante que a mudança seja salva)
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) { // VERIFICAÇÃO ADICIONADA AQUI
    darkModeToggle.addEventListener('change', (event) => {
        applyMode(event.currentTarget.checked);
    });
}