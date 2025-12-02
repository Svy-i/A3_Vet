// js/theme.js

import { initAuthListener, saveUserData, getCurrentUser } from './auth.js';

// Constante para a chave no Firestore (dentro de "preferencias")
const FIREBASE_THEME_KEY = 'preferencias.darkMode';

/**
 * Aplica o tema 'dark-mode' ao elemento raiz e atualiza o toggle.
 * 🚨 IMPORTANTE: Remove o salvamento do localStorage daqui. Ele será feito APENAS em loadAndApplyTheme
 * se o tema for carregado do Firebase (ou seja, se o usuário estiver logado).
 * @param {boolean} isDarkMode Se deve aplicar o modo escuro.
 */
function applyTheme(isDarkMode) {
    const root = document.documentElement; // Usa a tag <html>
    const toggle = document.getElementById('dark-mode-toggle');

    if (root) {
        if (isDarkMode) {
            root.classList.add('dark-mode');
        } else {
            root.classList.remove('dark-mode');
        }
    }
    
    if (toggle) {
        toggle.checked = isDarkMode;
    }
}

/**
 * Tenta carregar o tema do usuário logado e aplica. 
 * Se logado, sobrepõe o localStorage com a preferência do Firebase.
 * Se deslogado, volta para o Light Mode e limpa o localStorage.
 * @param {object|null} user O objeto do usuário atualizado.
 */
function loadAndApplyTheme(user) {
    let isDarkMode = false;
    
    if (user && user.preferencias) {
        // 1. USUÁRIO LOGADO: Carrega do Firebase
        isDarkMode = user.preferencias.darkMode === true; 
        
        // 🚨 NOVO: Atualiza o localStorage APENAS com a preferência do usuário logado.
        localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light'); 

        console.log(`Tema carregado do Firebase: ${isDarkMode ? 'Dark' : 'Light'}`);

    } else {
        // 2. USUÁRIO DESLOGADO: Assume Light Mode como padrão de fallback
        isDarkMode = false;
        
        // 🚨 NOVO: Limpa o localStorage para garantir que o anti-flash use o padrão na próxima carga
        // Este é um fallback de segurança, pois o logout já limpa, mas garante
        localStorage.removeItem('themePreference'); 

        console.log("Usuário deslogado. Aplicando Light Mode padrão.");

        // Se quiser usar a preferência do sistema como fallback para deslogados:
        // isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
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
            
            // Aplica imediatamente
            applyTheme(isDarkMode); 
            
            // Salva no Firestore APENAS se o usuário estiver logado
            const user = getCurrentUser();
            if (user) {
                saveThemePreference(isDarkMode);
                // 🚨 O localStorage será atualizado na próxima carga pelo loadAndApplyTheme,
                // mas podemos atualizá-lo aqui também para consistência imediata:
                localStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light'); 
            } else {
                 console.log("Preferência de tema não salva: Usuário não logado.");
            }
        });
    }
});