import { auth, db, doc, getDoc, onAuthStateChanged } from './firebase.js';

// 🚨 NOVO NOME: Renomear para updateHomeProgress e expor globalmente
// para ser chamada pelo script do Roadmap quando o status muda.
window.updateHomeProgress = async function(userId) {
    const progressElement = document.getElementById('medicina-progress-percentage');
    const progressBar = document.getElementById('medicina-progress-bar');
    
    // Usar auth.currentUser se o userId não for passado (quando chamado pelo DOMContentLoaded)
    const user = auth.currentUser; 
    const finalUserId = userId || (user ? user.uid : null);
    
    // Configura a exibição inicial
    if (progressElement) progressElement.textContent = '0%'; 
    if (progressBar) progressBar.style.width = '0%';

    if (!finalUserId || !progressElement) return;

    try {
        const userRef = doc(db, "usuarios", finalUserId); 
        const docSnap = await getDoc(userRef);
        let percentage = 0;

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Lendo o campo 'medicinaPercentage'
            percentage = data.progress?.medicinaPercentage ?? 0;
        } else {
            console.warn("Documento do usuário não encontrado. Progresso inicializado em 0%.");
        }
        
        // Aplica o valor lido (arredondado para garantir que o número seja inteiro no display)
        const roundedPercentage = Math.round(percentage);

        progressElement.textContent = `${roundedPercentage}%`;
        if (progressBar) {
            progressBar.style.width = `${roundedPercentage}%`;
        }
        
    } catch (error) {
        console.error("Erro detalhado ao carregar o progresso do Firestore:", error.message); 
        if (progressElement) progressElement.textContent = 'Erro';
    }
}


// =================================================================
// LÓGICA PRINCIPAL (home.js)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (restante da lógica de criação de botões, etc.) ...

    // 🚨 LÓGICA DE PROGRESSO: Monitora o estado de autenticação
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuário logado: Chama a nova função de atualização
            window.updateHomeProgress(user.uid);
        } else {
            console.log("Usuário deslogado. Progresso não carregado.");
            const progressElement = document.getElementById('medicina-progress-percentage');
            if (progressElement) progressElement.textContent = '0%';
        }
    });
});