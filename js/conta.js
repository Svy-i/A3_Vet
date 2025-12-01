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
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Erro ao sair:", error);
    }
});
