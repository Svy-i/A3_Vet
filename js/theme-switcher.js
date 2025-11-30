(function() {
    // Tenta obter o tema do localStorage.
    // O tema deve ser salvo aqui pelo theme.js após cada alternância no Firestore.
    let savedTheme = localStorage.getItem('themePreference'); 
    
    let isDarkMode = false;
    
    if (savedTheme === 'dark') {
        isDarkMode = true;
    } else if (savedTheme === 'light') {
        isDarkMode = false;
    } else {
        // Se não houver preferência salva, verifica a preferência do sistema (melhor que nada)
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode'); // Mantemos no body também, caso o CSS use
    }
})();