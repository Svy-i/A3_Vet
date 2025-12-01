import { 
    auth, 
    onAuthStateChanged, 
    signOut, 
    db,
    // Importações do Firestore para manipulação de documentos
    doc, 
    getDoc,
    updateDoc
} from './firebase.js';

// Estado global do usuário
let currentUser = null;

// ----------------------------------------------------------------------
// FUNÇÕES DE MANIPULAÇÃO DO FIRESTORE (DADOS DO PERFIL, PREFERÊNCIAS)
// ----------------------------------------------------------------------

/**
 * Busca dados adicionais do usuário no Firestore, incluindo preferências.
 * @param {string} uid O UID do usuário.
 * @returns {object|null} Os dados do documento do usuário ou null.
 */
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

/**
 * Salva ou atualiza dados específicos no documento do usuário logado.
 * Usa updateDoc, garantindo que apenas os campos fornecidos sejam alterados (merge implícito).
 * @param {string} uid O UID do usuário atual.
 * @param {object} data Um objeto contendo os campos a serem atualizados (ex: {'preferencias.dark_mode': true}).
 * @returns {boolean} Sucesso da operação.
 */
export async function saveUserData(uid, data) {
    if (!uid) {
        console.error("UID não fornecido. Não é possível salvar dados.");
        return false;
    }
    try {
        const userRef = doc(db, "usuarios", uid);
        await updateDoc(userRef, data);
        console.log("Dados do usuário atualizados com sucesso!");

        // 🎯 ATUALIZAÇÃO DO ESTADO GLOBAL: Mescla os novos dados com o currentUser existente
        if (currentUser) {
            // Recarrega o currentUser com dados frescos, ou mescla profundamente
            // Para simplicidade, vamos assumir que data é o novo objeto de preferência/progresso
            const freshUserData = await getUserData(uid);
            currentUser = {
                 uid: currentUser.uid, 
                 email: currentUser.email,
                 ...freshUserData // Sobrescreve dados antigos com os frescos
            };
        }

        return true;
    } catch (err) {
        console.error('Erro ao salvar dados do usuário:', err);
        return false;
    }
}

// ----------------------------------------------------------------------
// FUNÇÕES DE AUTENTICAÇÃO E ESTADO GLOBAL
// ----------------------------------------------------------------------

/**
 * Monitora mudanças de autenticação e busca dados adicionais do Firestore.
 * @param {function} callback Função a ser executada com o objeto do usuário atualizado.
 */
export function initAuthListener(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Busca DADOS ADICIONAIS do Firestore
            const userData = await getUserData(user.uid);
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                metadata: user.metadata, 
                ...userData // Espalha todos os campos do Firestore (preferencias, nome, etc.)
            };
        } else {
            currentUser = null;
        }
        
        if (callback) {
            callback(currentUser);
        }
    });
}

/**
 * Retorna o usuário atual (incluindo dados do Firestore).
 * 🚨 Nota: Esta função retorna o objeto **cached** (em cache).
 * Use-a com cautela logo após login/salvamento; o `initAuthListener` garante os dados frescos.
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * Faz logout do usuário.
 */
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

// ----------------------------------------------------------------------
// FUNÇÕES DE VALIDAÇÃO E TRADUÇÃO (MANTIDAS)
// ----------------------------------------------------------------------

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

export function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validarSenha(senha) {
    return senha && senha.length >= 6;
}