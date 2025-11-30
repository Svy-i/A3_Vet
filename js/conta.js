// js/conta.js

import { auth, signOut } from './firebase.js';
import { initAuthListener } from './auth.js'; 

// ----------------------------------------------------
// 🎯 FUNÇÕES AUXILIARES
// ----------------------------------------------------

/**
 * Previne o carregamento de cache (BFCache) em navegadores para garantir
 * que a autenticação seja verificada em cada visita.
 */
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// ----------------------------------------------------
// 🚀 INICIALIZAÇÃO E LÓGICA PRINCIPAL
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // 🎯 VARIÁVEIS DE DOM
    const userInfoDiv = document.getElementById('user-info');
    const boasVindas = document.getElementById('boas-vindas');
    const userEmail = document.getElementById('user-email');
    const userDob = document.getElementById('user-dob');
    const userCreated = document.getElementById('user-created');
    const logoutBtn = document.getElementById('logout-btn');

    // Inicializa o listener de autenticação unificado
    initAuthListener((user) => {
        if (!user) {
            // Se deslogado, redireciona
            console.log("Usuário deslogado. Redirecionando para login.");
            if (userInfoDiv) {
                userInfoDiv.style.display = 'none';
            }
            window.location.replace('login.html');
        } else {
            // 1. POPULA DADOS DO PERFIL
            
            // Boas-vindas e Email (obrigatórios)
            if (boasVindas && userEmail) {
                const nomeParaExibir = user.nome || user.displayName || user.email;
                boasVindas.textContent = `Bem-vindo(a), ${nomeParaExibir}`;
                userEmail.textContent = `Email: ${user.email}`;
            }

            // Data de Nascimento (opcional - dado do Firestore)
            if (userDob) {
                userDob.textContent = user.nascimento 
                    ? `Data de Nascimento: ${user.nascimento}` 
                    : 'Data de Nascimento: Não informada';
            }

            // Membro desde (dado do Firestore ou Firebase Auth Metadata)
            if (userCreated) {
                let dataMembro;
                if (user.criadoEm) {
                    dataMembro = new Date(user.criadoEm);
                } else if (user.metadata?.creationTime) {
                    dataMembro = new Date(user.metadata.creationTime);
                }

                if (dataMembro) {
                    userCreated.textContent = `Membro desde: ${dataMembro.toLocaleDateString('pt-BR')}`;
                } else {
                    userCreated.textContent = 'Membro desde: Informação indisponível';
                }
            }
            
            // 🎯 CORREÇÃO DO FLASH: Torna o conteúdo visível
            // O tema já foi sincronizado pelo theme.js antes de chegarmos aqui.
            if (userInfoDiv) {
                userInfoDiv.style.display = 'block'; 
            }
        }
    });

    // ----------------------------------------------------
    // LÓGICA DO BOTÃO DE LOGOUT
    // ----------------------------------------------------
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (!confirm('Tem certeza que deseja sair da conta?')) return;
            
            try {
                await signOut(auth);
                
                // Limpeza Crítica: O tema volta para a preferência do SO (ou Light Mode)
                localStorage.clear(); 
                
                if (userInfoDiv) {
                    userInfoDiv.style.display = 'none';
                }
                alert('Você saiu da conta.');
                
                window.location.replace('login.html');
            } catch (error) {
                console.error("FALHA NO LOGOUT:", error);
                alert('Erro ao sair: ' + error.message);
            }
        });
    }
});