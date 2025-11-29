// Application state
let selectedTopic = null;

function toggleTopic(topicId) {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    // Alterna o estado: se está true, vira false; se está undefined/false, vira true
    saved[topicId] = !saved[topicId]; 
    localStorage.setItem("progress", JSON.stringify(saved));
    
    // 🚨 AQUI ESTÁ A CORREÇÃO PRINCIPAL
    // Garante que as funções de renderização sejam chamadas se existirem no escopo (document.onload)
    if (typeof renderRoadmap === 'function') {
        renderRoadmap(true); // Redesenha para atualizar os ícones
    }
    if (typeof hideTopicDetail === 'function') {
        hideTopicDetail(); // Fecha o painel para mostrar a mudança
    }
}

function updateTopicStatus(topicData) {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    
    if (saved[topicData.id]) {
        topicData.status = 'completed';
    } else if (topicData.isPlaceholder) {
        topicData.status = 'not-started';
    } else {
        // Se o status anterior era 'completed', e agora foi desmarcado, ele volta para 'in-progress'
        // Se o tópico foi clicado (aberto o painel), também consideramos 'in-progress'
        topicData.status = 'in-progress'; 
    }
}



document.addEventListener('DOMContentLoaded', () => {

    // 1. Variáveis e referências do DOM (ESCOPO LOCAL)
    const roadmapContainer = document.getElementById('roadmapContainer');
    const topicDetail = document.getElementById('topicDetail');
    const overlay = document.getElementById('overlay');
    const closeDetailBtn = document.getElementById('closeDetail');
    const homeBtn = document.getElementById('homeBtn');
    const completeBtn = document.querySelector('#detailActions .btn-outline');
    const notesBtn = document.getElementById('notesBtn'); // NOVO
    const notesArea = document.getElementById('notesArea'); // NOVO
    const topicNotes = document.getElementById('topicNotes'); // NOVO

    // 1. Salvar Anotações
    function saveNotes() {
        if (selectedTopic && topicNotes) {
            const topicId = selectedTopic.id;
            const notesContent = topicNotes.value;
            
            // Salva as anotações no localStorage usando o ID do tópico
            localStorage.setItem(`notes-${topicId}`, notesContent);
        }
    }
    
    // 2. Carregar Anotações
    function loadNotes(topicId) {
        // Carrega anotações do localStorage
        return localStorage.getItem(`notes-${topicId}`) || '';
    }

    // 3. Alternar a visibilidade da área de anotações
    function toggleNotesArea() {
        notesArea.classList.toggle('show');
        notesBtn.classList.toggle('active'); // O botão de texto será destacado quando ativo
        
        if (notesArea.classList.contains('show')) {
            topicNotes.focus(); 
        }
    }

    // Mantenha icons e getStatusIcon AQUI DENTRO (ou no topo, mas juntos)
    // Para simplificar, vamos colocar aqui para que createRoadmapNode possa usá-los.
    const icons = {
        checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        circle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon"><circle cx="12" cy="12" r="10"></circle></svg>`,
        bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon icon-pink"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
        fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
    };

    // Get status icon (Agora usa o 'icons' local)
    function getStatusIcon(status) {
        switch (status) {
            case 'completed':
                return icons.checkCircle;
            case 'in-progress':
                return icons.circle;
            default:
                return '';
        }
    }
    
    // 2. Funções de manipulação de DOM (MANTIDAS AQUI DENTRO)
    function createRoadmapNode(topic, index, isLast) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'roadmap-node';
        
        const hasSubtopics = topic.subtopics.length > 0;
        const lineWidth = isLast ? 0 : (hasSubtopics ? 280 : 200);

        nodeDiv.innerHTML = `
            <p class="node-title ${topic.isPlaceholder ? 'placeholder' : ''}">${topic.title}</p>
            
            <div class="node-wrapper">
                <button class="node-button" data-topic-id="${topic.id}" aria-label="View ${topic.title}">
                    <div class="node-glow"></div>
                    <div class="node-outer">
                        <div class="node-inner">
                            ${getStatusIcon(topic.status)}
                        </div>
                    </div>
                </button>
                
                ${!isLast ? `
                    <div class="node-line desktop-only">
                        <svg width="${lineWidth}" height="2" viewBox="0 0 ${lineWidth} 2" fill="none" preserveAspectRatio="none">
                            <line x1="0" y1="1" x2="${lineWidth}" y2="1" stroke="#FF4581" stroke-width="1"/>
                        </svg>
                    </div>
                ` : ''}
            </div>
            
            ${hasSubtopics ? `
                <div class="node-subtopics">
                    <div class="subtopics-card">
                        <ul class="subtopics-list">
                            ${topic.subtopics.map(subtopic => `
                                <li class="subtopic-item">
                                    <span class="subtopic-bullet">•</span>
                                    <span>${subtopic.title}</span> 
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}
        `;
        
        return nodeDiv;
    }
    
    // Render roadmap
    window.renderRoadmap = function(isUpdate = false) { 
        // PASSO CHAVE: Sincronizar os dados do roadmap (na memória) com o localStorage
        roadmapData.topics.forEach(topic => {
            updateTopicStatus(topic); // Usa a função global (ou definida no escopo superior)
        });
        
        const isDesktop = window.innerWidth >= 1024;
        const pathDiv = document.createElement('div');
        pathDiv.className = isDesktop ? 'roadmap-path' : 'roadmap-path-vertical';
        
        roadmapData.topics.forEach((topic, index) => {
            const isLast = index === roadmapData.topics.length - 1;
            const nodeElement = createRoadmapNode(topic, index, isLast);
            pathDiv.appendChild(nodeElement);
            
            // Add vertical line for mobile
            if (!isDesktop && !isLast) {
                const verticalLine = document.createElement('div');
                verticalLine.className = 'vertical-line';
                pathDiv.appendChild(verticalLine);
            }
        });
        
        // Limpar e adicionar
        // Garante a substituição completa dos nós para refletir o novo status
        roadmapContainer.innerHTML = ''; 
        roadmapContainer.appendChild(pathDiv);
        
        // Add click listeners to nodes
        const nodeButtons = roadmapContainer.querySelectorAll('.node-button');
        nodeButtons.forEach(button => {
            button.addEventListener('click', handleNodeClick);
        });
    }

    // Handle node click
    function handleNodeClick(event) {
        const topicId = event.currentTarget.dataset.topicId;
        // 🚨 CORREÇÃO: Re-encontrar o tópico no roadmapData, que já foi atualizado pelo renderRoadmap
        const topic = roadmapData.topics.find(t => t.id === topicId); 
        
        if (topic) {
            showTopicDetail(topic);
        }
    }

    // Show topic detail (Usa as constantes locais: topicDetail, overlay, icons)
    function showTopicDetail(topic) {
        selectedTopic = topic;
        
        
        const allNodes = document.querySelectorAll('.node-button');
        allNodes.forEach(node => node.classList.remove('active'));
        
        const activeNode = document.querySelector(`[data-topic-id="${topic.id}"]`);
        if (activeNode) {
            activeNode.classList.add('active');
        }
        
        // Update detail panel
        document.getElementById('detailTitle').textContent = topic.title;
        
        // Update status badge
        const statusBadge = document.getElementById('detailStatus');
        const statusText = {
            'completed': 'Concluído',
            'in-progress': 'Em Progresso',
            'not-started': 'Não Iniciado'
        }[topic.status] || 'Não Iniciado';
        
        const statusClass = {
            'completed': 'completed',
            'in-progress': 'in-progress',
            'not-started': 'not-started'
        }[topic.status] || 'not-started';
        
        statusBadge.textContent = statusText;
        statusBadge.className = `status-badge ${statusClass}`;
        
        // Update description
        const descriptionDiv = document.getElementById('detailDescription');
        if (topic.description) {
            descriptionDiv.innerHTML = `
                <div class="section-header">
                    ${icons.bookOpen}
                    <h3>Descrição do Tópico</h3>
                </div>
                <p class="section-description">${topic.description}</p>
            `;
            descriptionDiv.style.display = 'block';
        } else {
            descriptionDiv.style.display = 'none';
        }
        
        // Update subtopics
        const subtopicsDiv = document.getElementById('detailSubtopics');
        if (topic.subtopics && topic.subtopics.length > 0) {
            subtopicsDiv.innerHTML = `
                <h3>Conteúdo Programático</h3>
                <ul class="subtopics-detail-list">
                    ${topic.subtopics.map(subtopic => `
                        <li class="subtopic-detail-item">
                            <span class="subtopic-bullet">•</span>
                            <a href="${subtopic.url}" class="subtopic-link" target="_blank" rel="noopener noreferrer">
                                <span class="subtopic-detail-text">${subtopic.title}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            `;
            subtopicsDiv.style.display = 'block';
        } else {
            subtopicsDiv.style.display = 'none';
        }
        
        // Update resources
        const resourcesDiv = document.getElementById('detailResources');
        if (topic.resources && topic.resources.length > 0) {
            resourcesDiv.innerHTML = `
                <div class="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon icon-blue">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3>Recursos</h3>
                </div>
                <div class="resources-list">
                    ${topic.resources.map(resource => `
                        <div class="resource-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-blue">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span class="resource-text">${resource}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            resourcesDiv.style.display = 'block';
        } else {
            resourcesDiv.style.display = 'none';
        }

        const notes = loadNotes(topic.id);
        topicNotes.value = notes;
        notesArea.classList.remove('show');
        notesBtn.classList.remove('active');

        topicDetail.classList.add('show');
        overlay.classList.add('show');
        
        // Show/hide placeholder message
        const placeholderDiv = document.getElementById('detailPlaceholder');
        if (topic.isPlaceholder) {
            placeholderDiv.style.display = 'block';
        } else {
            placeholderDiv.style.display = 'none';
        }

        if (completeBtn) {
            if (topic.status === 'completed') {
                completeBtn.textContent = 'Desmarcar Conclusão';
                completeBtn.classList.add('completed');
            } else {
                completeBtn.textContent = 'Marcar como Concluído';
                completeBtn.classList.remove('completed');
            }
        }
        
        topicDetail.classList.add('show');
        overlay.classList.add('show');
    }

    // Hide topic detail (Usa as constantes locais: topicDetail, overlay)
    window.hideTopicDetail = function() {
        saveNotes();
        notesArea.classList.remove('show');
        notesBtn.classList.remove('active');

        topicDetail.classList.remove('show');
        overlay.classList.remove('show');
        
        const allNodes = document.querySelectorAll('.node-button');
        allNodes.forEach(node => node.classList.remove('active'));
        
        selectedTopic = null;
    }

    if (notesBtn) {
        notesBtn.addEventListener('click', toggleNotesArea);
    }
    
    // Listener para salvar as anotações automaticamente a cada digitação (debounce idealmente, mas simples aqui)
    if (topicNotes) {
        // Usa 'input' para capturar mudanças rapidamente
        topicNotes.addEventListener('input', saveNotes); 
    }
    
    // Handle home button click
    function handleHomeClick() {
        hideTopicDetail();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleCompleteClick() {
        if (selectedTopic) {
            toggleTopic(selectedTopic.id);
        }
    }

    // 3. Inicialização e Event Listeners
    if (roadmapContainer) {
        renderRoadmap();
    } else {
        console.error("Erro: Elemento 'roadmapContainer' não encontrado.");
        return;
    }
    
    // Anexação dos Listeners (CORRETA)
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', hideTopicDetail);
    if (overlay) overlay.addEventListener('click', hideTopicDetail);
    if (homeBtn) homeBtn.addEventListener('click', handleHomeClick);
    if (completeBtn) completeBtn.addEventListener('click', handleCompleteClick);

    // Event listeners que dependem de 'renderRoadmap'
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderRoadmap();
        }, 250);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && selectedTopic) {
            hideTopicDetail();
        }
    });
    
    // FIM do DOMContentLoaded
});