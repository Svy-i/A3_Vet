// ----------------------------------------------------
// 🎯 IMPORTS
// ----------------------------------------------------
import { auth, signOut } from './firebase.js';
import { initAuthListener } from './auth.js'; 


// ----------------------------------------------------
// 🎯 PREVENIR BFCache (back-forward cache)
// ----------------------------------------------------
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// 👉 REMOVIDO: o beforeunload com signOut (Firefox ignora async aqui)


// ----------------------------------------------------
// 🚀 INICIALIZAÇÃO E LÓGICA PRINCIPAL
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    const userInfoDiv = document.getElementById('user-info');
    const boasVindas = document.getElementById('boas-vindas');
    const userEmail = document.getElementById('user-email');
    const userDob = document.getElementById('user-dob');
    const userCreated = document.getElementById('user-created');
    const logoutBtn = document.getElementById('logout-btn');


    // ----------------------------------------------------
    // 🔐 LISTENER GLOBAL DE AUTENTICAÇÃO
    // ----------------------------------------------------
    initAuthListener((user) => {
        if (!user) {
            console.log("Usuário deslogado. Redirecionando para login.");
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            window.location.replace('login.html');
            return;
        }

        // Preenche dados do perfil
        if (boasVindas && userEmail) {
            const nomeParaExibir = user.nome || user.displayName || user.email;
            boasVindas.textContent = `Bem-vindo(a), ${nomeParaExibir}`;
            userEmail.textContent = `Email: ${user.email}`;
        }

        if (userDob) {
            userDob.textContent = user.nascimento 
                ? `Data de Nascimento: ${user.nascimento}`
                : 'Data de Nascimento: Não informada';
        }

        if (userCreated) {
            let dataMembro;

            if (user.criadoEm) dataMembro = new Date(user.criadoEm);
            else if (user.metadata?.creationTime) dataMembro = new Date(user.metadata.creationTime);

            if (dataMembro) {
                userCreated.textContent = `Membro desde: ${dataMembro.toLocaleDateString('pt-BR')}`;
            } else {
                userCreated.textContent = 'Membro desde: Informação indisponível';
            }
        }

        if (userInfoDiv) userInfoDiv.style.display = 'block';
    });


    // ----------------------------------------------------
    // 🔓 BOTÃO DE LOGOUT (CORRIGIDO PARA FIREFOX)
    // ----------------------------------------------------
    if (logoutBtn) {

        logoutBtn.addEventListener('click', async () => {

            if (!confirm('Tem certeza que deseja sair da conta?')) return;

            try {
                // Logout seguro no Firebase
                await signOut(auth);

                // Limpa tudo
                localStorage.clear();
                if (userInfoDiv) userInfoDiv.style.display = 'none';

                // 🔥 ALERTA FUNCIONANDO EM TODOS OS NAVEGADORES
                alert('Você saiu da conta.');

                // ----------------------------------------------------
                // ✔ REDIRECIONAMENTO 100% COMPATÍVEL COM FIREFOX
                // (Firefox só deixa redirecionar após uma nova task queue)
                // ----------------------------------------------------
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.location.replace('index.html');
                    });
                });

            } catch (error) {
                console.error("FALHA NO LOGOUT:", error);
                alert('Erro ao sair: ' + error.message);
            }
        });
    }
});
