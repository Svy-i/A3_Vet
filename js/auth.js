// Gerenciador de Autenticação e Usuário
import { auth, onAuthStateChanged, signOut, db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Estado global do usuário
let currentUser = null;

// Função para obter dados adicionais do usuário
export async function getUserData(uid) {
    try {
        const userDoc = await getDoc(doc(db, "usuarios", uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        return null;
    }
}

// Monitora mudanças de autenticação
export function initAuthListener(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Busca dados adicionais do Firestore
            const userData = await getUserData(user.uid);
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                ...userData
            };
        } else {
            currentUser = null;
        }
        
        if (callback) {
            callback(currentUser);
        }
    });
}

// Retorna o usuário atual
export function getCurrentUser() {
    return currentUser;
}

// Verifica se o usuário está autenticado
export function isAuthenticated() {
    return currentUser !== null;
}

// Faz logout
export async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        return true;
    } catch (err) {
        console.error('Erro ao fazer logout:', err);
        return false;
    }
}

// Traduz erros de autenticação para português
export function traduzErro(err) {
    const code = err.code || '';
    
    const erros = {
        'auth/invalid-email': 'Email inválido.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/weak-password': 'A senha é muito fraca (mínimo 6 caracteres).',
        'auth/email-already-in-use': 'Este email já está registrado.',
        'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
        'auth/account-exists-with-different-credential': 'Uma conta com esse email já existe.',
    };
    
    return erros[code] || 'Erro: ' + (err.message || 'tente novamente.');
}

// Validação de email
export function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de senha
export function validarSenha(senha) {
    return senha && senha.length >= 6;
}
