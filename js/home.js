import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from './firebase.js';

// Definição de todos os módulos e seus campos correspondentes no Firestore
const MODULE_CONFIG = [
    { id: 'medicina', field: 'medicinaPercentage' },
    { id: 'praticas_veterinarias', field: 'praticas_veterinariasPercentage' },
    { id: 'sistemas_vitais', field: 'sistemas_vitaisPercentage' },
    { id: 'reproducao_animal', field: 'reproducao_animalPercentage' },
    { id: 'biotecnologia', field: 'biotecnologiaPercentage' },
    { id: 'saude_animal', field: 'saude_animalPercentage' }
];

// ------------------------------------------------------------------
// 1. Funções de Atualização da UI
// ------------------------------------------------------------------

/**
 * Atualiza a barra de progresso e o texto para um módulo específico.
 * @param {string} moduleId - O ID do módulo (ex: 'medicina').
 * @param {number} percentage - A porcentagem de progresso.
 */
function updateModuleUI(moduleId, percentage) {
    const roundedPercentage = Math.round(percentage);
    const progressElement = document.getElementById(`${moduleId}-progress-percentage`);
    const progressBar = document.getElementById(`${moduleId}-progress-bar`);

    if (progressBar) {
        progressBar.style.width = `${roundedPercentage}%`;
    }
    
    if (progressElement) {
        progressElement.textContent = `${roundedPercentage}%`;
    }
}

/**
 * Controla a visibilidade dos links de Login/Cadastro e Perfil no cabeçalho.
 * @param {object | null} user - O objeto de usuário do Firebase ou null.
 */
function updateHeaderLinks(user) {
    const profileLink = document.getElementById('profile-link');
    const authLinksDiv = document.getElementById('auth-links');

    if (user) {
        // Usuário Logado
        if (profileLink) profileLink.style.display = 'flex'; // Mostra Perfil
        if (authLinksDiv) authLinksDiv.style.display = 'none'; // Esconde Login/Cadastro
    } else {
        // Usuário Deslogado
        if (profileLink) profileLink.style.display = 'none'; // Esconde Perfil
        if (authLinksDiv) authLinksDiv.style.display = 'flex'; // Mostra Login/Cadastro
    }
}

// ------------------------------------------------------------------
// 2. Função de Carregamento de Progresso
// ------------------------------------------------------------------

/**
 * Carrega e atualiza o progresso de todos os módulos.
 * Exposto globalmente para ser chamado por outros scripts se necessário.
 * @param {string | null} userId - O UID do usuário atual.
 */
window.updateAllModulesProgress = async function(userId) {
    const finalUserId = userId || (auth.currentUser ? auth.currentUser.uid : null);
    
    // Inicializa todas as barras em 0%
    MODULE_CONFIG.forEach(module => updateModuleUI(module.id, 0));

    if (!finalUserId) {
        console.log("Usuário deslogado. Progresso não carregado.");
        return;
    }

    try {
        const userRef = doc(db, "usuarios", finalUserId); 
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Itera sobre todos os módulos e atualiza o progresso
            MODULE_CONFIG.forEach(module => {
                // Lê a porcentagem do objeto 'progress' no Firestore
                const percentage = data.progress?.[module.field] ?? 0;
                updateModuleUI(module.id, percentage);
            });
        } else {
            console.warn("Documento do usuário não encontrado.");
        }
        
    } catch (error) {
        console.error("Erro detalhado ao carregar o progresso do Firestore:", error.message); 
    }
}

// ------------------------------------------------------------------
// 3. Lógica Principal e Listener de Autenticação
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. 🔑 Inicialização de Segurança: Garante que os links de Login/Cadastro
    // estão visíveis por padrão, antes que o Firebase resolva o estado.
    updateHeaderLinks(null); 

    // 2. 🚨 Listener de Autenticação: Monitora o estado
    onAuthStateChanged(auth, async (user) => { // Tornamos async para a correção do Firefox
        // Atualiza o cabeçalho imediatamente com o estado resolvido
        updateHeaderLinks(user); 

        if (user) {
            // Usuário logado: Carrega o progresso
            window.updateAllModulesProgress(user.uid);
        } else {
            // Usuário deslogado:
            
            // 🛑 CORREÇÃO FIREFOX/FLASH: Se o auth.currentUser ainda existir (o flash)
            if (auth.currentUser) {
                console.warn("Detectado 'flash' de autenticação. Forçando signOut para limpar o token.");
                try {
                    await signOut(auth);
                    // Chamamos updateHeaderLinks(null) novamente para garantir
                    updateHeaderLinks(null); 
                } catch (error) {
                    console.error("Erro ao forçar signOut:", error);
                }
            }
            
            // Zera o progresso na UI
            window.updateAllModulesProgress(null); 
        }
    });
});