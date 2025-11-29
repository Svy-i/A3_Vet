// Salva / alterna estado do tópico
function toggleTopic(topicId) {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    saved[topicId] = !saved[topicId];
    localStorage.setItem("progress", JSON.stringify(saved));
    
    // updateProgressBars precisa ser chamada aqui para atualizar a barra do roadmap
    updateProgressBars(); 
}

// Calcula progresso total
function calculateProgress() {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    const TOTAL_TOPICS = 5; 
    const done = Object.values(saved).filter(v => v).length;
    return (done / TOTAL_TOPICS) * 100;
}

// Função para atualizar a barra de progresso na HOME (módulo Medicina)
function updateHomeProgress() {
    const percent = calculateProgress();
    const fillElement = document.getElementById("medicina-fill");
    const textElement = document.getElementById("medicina-progress-text");

    if (fillElement && textElement) {
        fillElement.style.width = percent + "%";
        textElement.textContent = Math.round(percent) + "% concluído";
    }
}

// Atualiza barras e porcentagens (Página do Roadmap)
function updateProgressBars() {
    const percent = calculateProgress();
    const fillBar = document.querySelector(".progress-bar .fill");
    const progressText = document.getElementById("progress-text");

    if (fillBar && progressText) {
        fillBar.style.width = percent + "%";
        progressText.textContent = Math.round(percent) + "% concluído";
    }
    
    // Atualiza o estado visual dos checkboxes
    updateCheckboxes();
    
    // **Chamamos updateHomeProgress aqui também** para garantir que se o usuário
    // estiver na home e voltar para o roadmap, ao marcar ele atualiza o localStorage
    // e atualiza a barra na página home. (Embora a home só se atualize no refresh, é bom garantir)
    // OBS: O único impacto visível real é no roadmap (com updateCheckboxes e updateProgressBars)
    // A barra da Home só reflete no próximo carregamento da Home.
}

// Marca checkboxes salvos (Página do Roadmap)
function updateCheckboxes() {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};

    document.querySelectorAll(".topic input[type='checkbox']").forEach(input => {
        // Encontra o ID correto do tópico
        const label = input.closest('label');
        if (label) {
            // Assume que o ID está no 'onchange' como 'mod1-topicoX'
            const idMatch = input.getAttribute("onchange").match(/'(.*?)'/);
            const id = idMatch ? idMatch[1] : null;
            
            if (id) {
                input.checked = saved[id] || false;
            }
        }
    });
}


// **CORREÇÃO MAIS IMPORTANTE: Unificar o window.onload**
window.onload = function() {
    // Se estiver na página do roadmap, atualiza tudo do roadmap.
    if (document.getElementById("progress-text")) {
        updateProgressBars();
    }
    
    // Se estiver na página HOME, atualiza a barra do módulo Medicina.
    if (document.getElementById("medicina-progress-text")) {
        updateHomeProgress();
    }
    
    // **Importante:** Se o usuário estiver na Home, updateCheckboxes não deve ser chamado,
    // pois a Home não tem os checkboxes do roadmap, apenas o código do main.js.
};