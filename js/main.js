import { auth, db, doc, getDoc, updateDoc, onAuthStateChanged } from './firebase.js';

// ** FUNÇÕES DE PROGRESSO DA HOME (Lê do Firebase) **
// ====================================================

/**
 * Lê o progresso do módulo Medicina no Firebase e atualiza o DOM.
 */

// ** FUNÇÕES LOCAIS DO ROADMAP (Se estiverem aqui, são de uso local) **
// (As funções como calculateProgress, updateProgressBars e updateCheckboxes 
//  devem ser movidas para roadmap.js se forem específicas dessa página.)

function calculateProgress() {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    const TOTAL_TOPICS_LOCAL = 5; 
    const done = Object.values(saved).filter(v => v).length;
    return (done / TOTAL_TOPICS_LOCAL) * 100;
}

function updateProgressBars() {
    const percent = calculateProgress();
    const fillBar = document.querySelector(".progress-bar .fill");
    const progressText = document.getElementById("progress-text");

    if (fillBar && progressText) {
        fillBar.style.width = percent + "%";
        progressText.textContent = Math.round(percent) + "% concluído";
    }
    updateCheckboxes();
}

function updateCheckboxes() {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};

    document.querySelectorAll(".topic input[type='checkbox']").forEach(input => {
        const idMatch = input.getAttribute("onchange").match(/'(.*?)'/);
        const id = idMatch ? idMatch[1] : null;
        
        if (id) {
            input.checked = saved[id] || false;
        }
    });
}


// ** INICIALIZAÇÃO **
// ====================

// Escuta o estado de autenticação para carregar o progresso da Home
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica da Home (Carregar progresso do módulo após autenticação)
    if (document.getElementById("medicina-progress-text")) {
        onAuthStateChanged(auth, (user) => {
            updateHomeProgress();
        });
    }

    // 2. Lógica do Roadmap (Se estiver na página do roadmap, atualiza as barras locais)
    // NOTE: Se esta página for a home, o check abaixo deve ser removido. 
    // Se for o roadmap, ele permanece, mas idealmente essas funções estariam em roadmap.js.
    if (document.getElementById("progress-text")) {
        updateProgressBars();
    }
});