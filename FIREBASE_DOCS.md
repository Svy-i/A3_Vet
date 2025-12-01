# 📚 Documentação Firebase - Jornada Vet

## ✅ Status da Integração

Seu Firebase está **100% conectado e funcionando** com as seguintes funcionalidades:

### 🔐 Autenticação
- ✅ Registro com email/senha
- ✅ Login com email/senha
- ✅ Login com Google
- ✅ Proteção de páginas (redirecionamento automático)
- ✅ Logout

### 📊 Firestore (Banco de Dados)
- ✅ Armazenamento de dados de usuário
- ✅ Coleta: `usuarios`
- ✅ Campos armazenados: nome, email, nascimento, data de criação

---

## 📁 Estrutura de Arquivos

```
js/
├── firebase.js      ← Configuração centralizada do Firebase
├── auth.js          ← Gerenciador de autenticação (NOVO)
├── conta.js         ← Legado (não está sendo usado)
├── main.js          ← Scripts gerais
├── theme.js         ← Tema escuro/claro
└── data.js          ← Dados estáticos

HTML:
├── index.html       ← Página inicial (públic)
├── cadastro.html    ← Registro com Firebase ✅
├── login.html       ← Login com Firebase ✅
└── perfil.html      ← Página protegida com dados do usuário ✅
```

---

## 🔧 Como Usar

### 1. **Importar funções do Firebase**

```javascript
// Para autenticação
import { 
  auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from './js/firebase.js';

// Para banco de dados
import { 
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from './js/firebase.js';
```

### 2. **Usar gerenciador de autenticação**

```javascript
import { 
  getCurrentUser, 
  initAuthListener, 
  traduzErro,
  validarEmail,
  validarSenha 
} from './js/auth.js';

// Monitora mudanças de autenticação
initAuthListener((user) => {
  if (user) {
    console.log('Usuário logado:', user.nome);
  } else {
    console.log('Usuário deslogado');
  }
});
```

### 3. **Estrutura de dados no Firestore**

Coleção: `usuarios`
```json
{
  "uid": {
    "nome": "João Silva",
    "email": "joao@example.com",
    "nascimento": "1990-05-15",
    "criadoEm": "2025-11-26T10:30:00.000Z"
  }
}
```

---

## 🚀 Fluxo de Autenticação

```
1. Usuário acessa cadastro.html
   ↓
2. Preenche formulário (nome, email, senha, data de nascimento)
   ↓
3. Firebase cria usuário em Authentication
   ↓
4. Dados adicionais salvos no Firestore
   ↓
5. Redireciona para perfil.html
   ↓
6. perfil.html verifica autenticação e exibe dados
```

---

## ⚠️ Erros Comuns

### "Email já está registrado"
→ Use um email novo ou faça login

### "Senha muito fraca"
→ Deve ter mínimo 6 caracteres

### "Usuário não encontrado"
→ Crie uma conta primeiro em cadastro.html

### "Muitas tentativas"
→ Aguarde alguns minutos antes de tentar novamente

---

## 🛠️ Adicionar Novas Funcionalidades

### Salvar mais dados no Firestore

```javascript
import { db, doc, updateDoc } from './js/firebase.js';

// Atualizar dados do usuário
await updateDoc(doc(db, "usuarios", user.uid), {
  telefone: "11999999999",
  endereco: "Rua X, 123",
  profissao: "Veterinário"
});
```

### Buscar dados do usuário

```javascript
import { getUserData } from './js/auth.js';

const userData = await getUserData(user.uid);
console.log(userData.nome, userData.email);
```

---

## 📞 Resumo da Configuração

- **Projeto Firebase:** a3-vet
- **API Key:** AIzaSyD6AbvFKXPxUCQHLavGVbii4Xc_j3FQsVE
- **Auth Domain:** a3-vet.firebaseapp.com
- **Firestore Database:** a3-vet
- **Storage:** a3-vet.appspot.com

Tudo já está conectado e funcionando! 🎉
