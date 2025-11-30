import { auth, onAuthStateChanged, signOut } from './firebase.js';
import { getUserData } from './auth.js';

// 🎯 1. Previne o carregamento do cache (BFCache)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Garante que todo o script só rode após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {

    // 🎯 VARIÁVEIS DE DOM
    const userInfoDiv = document.getElementById('user-info');
    const boasVindas = document.getElementById('boas-vindas');
    const userEmail = document.getElementById('user-email');
    const userDob = document.getElementById('user-dob');
    const userCreated = document.getElementById('user-created');
    const logoutBtn = document.getElementById('logout-btn');

    // ----------------------------------------------------
    // LÓGICA DE PROTEÇÃO DE PÁGINA E CARREGAMENTO DE DADOS
    // ----------------------------------------------------
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Se deslogado, redireciona imediatamente
            window.location.replace('login.html');
        } else {
            // Se logado, torna o conteúdo visível
            if (userInfoDiv) {
                userInfoDiv.style.display = 'block'; 
            }
            
            // Popula as informações iniciais (Firebase Auth)
            if (boasVindas && userEmail) { 
                boasVindas.textContent = `Bem-vindo, ${user.displayName || user.email}`;
                userEmail.textContent = `Email: ${user.email}`;
            }

            // Busca dados adicionais do Firestore
            const userData = await getUserData(user.uid);
            if (userData) {
                if (userData.nome && boasVindas) {
                    boasVindas.textContent = `Bem-vindo, ${userData.nome}`;
                }
                if (userData.nascimento && userDob) {
                    userDob.textContent = `Data de Nascimento: ${userData.nascimento}`;
                }
                if (userData.criadoEm && userCreated) {
                    const date = new Date(userData.criadoEm).toLocaleDateString('pt-BR');
                    userCreated.textContent = `Membro desde: ${date}`;
                }
            }
        }
    });

    // ----------------------------------------------------
    // LÓGICA DO BOTÃO DE LOGOUT (AGORA SEMPRE REGISTRADA)
    // ----------------------------------------------------
    if (logoutBtn) {
        console.log("Verificação do Botão Logout: Listener registrado com sucesso.");
        
        logoutBtn.addEventListener('click', () => {
            console.log("1. Tentando signOut...");
            
            signOut(auth)
                .then(() => {
                    console.log("2. SUCESSO: Logout do Firebase CONCLUÍDO!"); 
                    
                    // 🎯 AÇÃO CRÍTICA: Limpeza Forçada do LocalStorage
                    localStorage.clear();
                    
                    // Oculta a div imediatamente para evitar flashes
                    if (userInfoDiv) {
                        userInfoDiv.style.display = 'none';
                    }

                    alert('Você saiu da conta.');
                    
                    // Redirecionamento (replace é crucial)
                    window.location.replace('index.html');
                })
                .catch((error) => {
                    console.error("3. FALHA NO LOGOUT:", error);
                    alert('Erro ao sair: ' + error.message);
                });
        });
    } else {
        console.error("ERRO CRÍTICO NO DOM: Botão de logout (id: 'logout-btn') não foi encontrado.");
    }
});