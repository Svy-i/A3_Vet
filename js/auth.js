// js/auth.js
import {
  auth,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  updateDoc
} from './firebase.js';

/**
 * Estado local do usuário (mescla auth + firestore)
 */
let currentUser = null;

/**
 * Busca dados adicionais do usuário no Firestore.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function getUserData(uid) {
  try {
    const userDocRef = doc(db, "usuarios", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) return snap.data();
    return null;
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    return null;
  }
}

/**
 * Atualiza campos do documento do usuário (merge).
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<boolean>}
 */
export async function saveUserData(uid, data) {
  if (!uid) {
    console.error("UID não fornecido para saveUserData.");
    return false;
  }
  try {
    const userRef = doc(db, "usuarios", uid);
    await updateDoc(userRef, data);
    // refresh local cached user
    const fresh = await getUserData(uid);
    currentUser = {
      uid,
      email: currentUser?.email || (fresh && fresh.email),
      ...fresh
    };
    return true;
  } catch (err) {
    console.error("Erro ao salvar dados do usuário:", err);
    return false;
  }
}

/**
 * initAuthListener - monitora onAuthStateChanged e completa com dados do Firestore.
 * @param {(userObj:object|null)=>void} callback
 * @returns {Function} unsubscribe
 */
export function initAuthListener(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // busca dados adicionais
      const extra = await getUserData(user.uid);
      currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        metadata: user.metadata,
        ...extra
      };
    } else {
      currentUser = null;
    }
    if (typeof callback === 'function') callback(currentUser);
  });
}

/**
 * Retorna o usuário "cachado" (inclui dados do Firestore quando disponíveis).
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Faz logout
 */
export async function logout() {
  try {
    await signOut(auth);
    currentUser = null;
    return true;
  } catch (err) {
    console.error("Erro ao fazer logout:", err);
    return false;
  }
}

/**
 * Tradução simples de erros do Firebase Auth para PT-BR
 */
export function traduzErro(err) {
  if (!err) return "Erro desconhecido.";
  const code = err.code || '';
  const map = {
    'auth/invalid-email': 'Email inválido.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/weak-password': 'A senha é muito fraca (mínimo 6 caracteres).',
    'auth/email-already-in-use': 'Este email já está registrado.',
    'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
    'auth/account-exists-with-different-credential': 'Uma conta com esse email já existe.',
  };
  return map[code] || ('Erro: ' + (err.message || 'tente novamente.'));
}

/**
 * Validações utilitárias simples
 */
export function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

export function validarSenha(senha) {
  return senha && senha.length >= 6;
}
