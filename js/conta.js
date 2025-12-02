// Importações Firebase
import { 
    auth, 
    db, 
    onAuthStateChanged, 
    signOut, 
    doc, 
    getDoc 
} from "./firebase.js";

// ----------- Função para formatar datas ----------------
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

// ----------- Listener de autenticação -------------------
onAuthStateChanged(auth, async (user) => {
    const userInfoBox = document.getElementById("user-info");
    const boasVindas = document.getElementById("boas-vindas");
    const userEmail = document.getElementById("user-email");
    const userDob = document.getElementById("user-dob");
    const userCreated = document.getElementById("user-created");

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error("Usuário não encontrado no banco.");
            return;
        }

        const userData = userSnap.data();

        // Preencher perfil
        boasVindas.textContent = "Olá, " + userData.nome + "!";
        userEmail.textContent = "Email: " + user.email;

        userDob.textContent =
            "Nascimento: " + formatarData(userData.nascimento);

        userCreated.textContent =
            "Conta criada em: " + formatarData(userData.criadoEm);

        userInfoBox.style.display = "block";

    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }
});

// ------------ Logout -----------------
document.getElementById("logout-btn").addEventListener("click", async () => {
    const confirmLogout = confirm("Tem certeza que deseja sair da sua conta?");

    if (confirmLogout) {
        try {
            // 🚨 NOVO: Remove a preferência de tema do localStorage ao sair.
            localStorage.removeItem('themePreference'); 
            
            // =======================================================
            // 🔑 NOVO: Lógica para limpar anotações locais (TEMPORÁRIAS)
            // =======================================================
            // Captura todas as chaves do localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // Se a chave começar com 'notes-', remove-a.
                if (key && key.startsWith('notes-')) {
                    localStorage.removeItem(key);
                    // Como a remoção altera o índice, precisamos decrementar 'i'
                    i--; 
                }
            }
            // =======================================================

            await signOut(auth);
            window.location.href = "index.html"; // Redireciona
        } catch (error) {
            console.error("Erro ao sair:", error);
            alert("Ocorreu um erro ao tentar sair. Tente novamente.");
        }
    }
});
