// js/theme.js

import { initAuthListener, saveUserData, getCurrentUser } from './auth.js';

// Constante para a chave no Firestore (dentro de "preferencias")
const FIREBASE_THEME_KEY = 'preferencias.darkMode';

/**
 * Aplica o tema 'dark-mode' ao body.
 * @param {boolean} isDarkMode Se deve aplicar o modo escuro.
 */
function applyTheme(isDarkMode) {
    const root = document.documentElement; // Usa a tag <html>
    const toggle = document.getElementById('dark-mode-toggle');

    if (root) {
        if (isDarkMode) {
            root.classList.add('dark-mode');
            // 🚨 NOVO: Salva a preferência no localStorage para o script anti-flash
            localStorage.setItem('themePreference', 'dark'); 
        } else {
            root.classList.remove('dark-mode');
            // 🚨 NOVO: Salva a preferência no localStorage para o script anti-flash
            localStorage.setItem('themePreference', 'light');
        }
    }
    
    if (toggle) {
        toggle.checked = isDarkMode;
    }
}

/**
 * Tenta carregar o tema do usuário logado e aplica. 
 * Também sobrepõe a preferência do localStorage (que foi usada pelo anti-flash)
 * com a preferência salva no Firebase.
 * @param {object|null} user O objeto do usuário atualizado.
 */
function loadAndApplyTheme(user) {
    let isDarkMode = false;
    
    if (user && user.preferencias) {
        // 1. Carrega do Firebase (se logado)
        isDarkMode = user.preferencias.darkMode === true; 
        console.log(`Tema carregado do Firebase: ${isDarkMode ? 'Dark' : 'Light'}`);
    } else {
        // 2. Se deslogado, volta para o localStorage ou preferência do sistema
        let savedTheme = localStorage.getItem('themePreference');
        if (savedTheme === 'dark') {
            isDarkMode = true;
        } else {
            // Se o localStorage não estiver definido (primeiro acesso)
            isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }
    
    // 🚨 Aplica o tema (e atualiza o localStorage)
    applyTheme(isDarkMode);
}

/**
 * Salva a preferência de tema do usuário no Firestore.
 * @param {boolean} isDarkMode O estado do tema a ser salvo.
 */
async function saveThemePreference(isDarkMode) {
    const user = getCurrentUser();
    
    if (!user || !user.uid) {
        console.error("Não é possível salvar a preferência: usuário não autenticado.");
        return;
    }

    try {
        // Salva o tema no caminho "preferencias.darkMode" no Firestore
        const data = {
            [FIREBASE_THEME_KEY]: isDarkMode 
        };
        await saveUserData(user.uid, data);
        console.log(`Preferência de tema (${isDarkMode ? 'Dark' : 'Light'}) salva com sucesso.`);
    } catch (error) {
        console.error("Erro ao salvar o tema:", error);
    }
}

// ----------------------------------------------------------------------
// INICIALIZAÇÃO E LISTENERS
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dark-mode-toggle');

    // 1. Inicia o monitoramento de autenticação e aplica o tema ao carregar
    initAuthListener(loadAndApplyTheme); 
    
    // 2. Listener para alternar o tema via switch
    if (toggle) {
        toggle.addEventListener('change', (event) => {
            const isDarkMode = event.target.checked;
            
            // Aplica imediatamente para a experiência do usuário
            applyTheme(isDarkMode); 
            
            // Salva no Firestore (assincronamente)
            const user = getCurrentUser();
            if (user) {
                saveThemePreference(isDarkMode);
            }
        });
    }
});

// A função applyTheme precisa ser chamada fora do DOMContentLoaded
// para ser executada o mais rápido possível (evitar "flash" de tema claro)
// Embora initAuthListener chame applyTheme, deixamos esta chamada para
// garantir que o estado inicial (preferência do sistema) seja aplicado antes
// do Auth, minimizando o flash.
// applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);