// Application state (Global)
let selectedTopic = null;

// =================================================================
// FUNÇÕES GLOBAIS DE STATUS (Acessíveis fora do DOMContentLoaded)
// =================================================================

/**
 * Alterna o status de conclusão de um tópico no localStorage e redesenha o roadmap.
 * @param {string} topicId - O ID do tópico.
 */
function toggleTopic(topicId) {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    // Alterna o estado: se está true, vira false; se está undefined/false, vira true
    saved[topicId] = !saved[topicId]; 
    localStorage.setItem("progress", JSON.stringify(saved));
    
    // Chamadas para funções expostas ao escopo global (window)
    if (typeof renderRoadmap === 'function') {
        renderRoadmap(true); // Redesenha para atualizar os ícones
    }
    if (typeof hideTopicDetail === 'function') {
        hideTopicDetail(); // Fecha o painel para mostrar a mudança
    }
}

/**
 * Atualiza o status de um objeto de tópico baseado no localStorage.
 * @param {object} topicData - O objeto do tópico (roadmapData.topics[i]).
 */
function updateTopicStatus(topicData) {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    
    if (saved[topicData.id]) {
        topicData.status = 'completed';
    } else if (topicData.isPlaceholder) {
        topicData.status = 'not-started';
    } else {
        topicData.status = 'in-progress'; 
    }
}

// =================================================================
// LÓGICA PRINCIPAL (Executada após o carregamento do DOM)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Variáveis e referências do DOM (ESCOPO LOCAL)
    const roadmapContainer = document.getElementById('roadmapContainer');
    const topicDetail = document.getElementById('topicDetail');
    const overlay = document.getElementById('overlay');
    const closeDetailBtn = document.getElementById('closeDetail');
    const homeBtn = document.getElementById('homeBtn');
    const completeBtn = document.querySelector('#detailActions .btn-outline');

    // Elementos de Anotações (V1)
    const notesBtn = document.getElementById('notesBtn');
    const notesArea = document.getElementById('notesArea');
    const topicNotes = document.getElementById('topicNotes');

    // Elementos de Vídeo (V2)
    const videoModal = document.getElementById('videoModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalPlayer = document.getElementById('videoModalPlayer');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoPanel = document.getElementById('videoPanel');
    const videoPanelContent = document.getElementById('videoPanelContent');
    const closeVideoPanelBtn = document.getElementById('closeVideoPanel');

    // Icons definitions
    const icons = {
        checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        circle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon"><circle cx="12" cy="12" r="10"></circle></svg>`,
        bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon icon-pink"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
        fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
    };

    function getStatusIcon(status) {
        switch (status) {
            case 'completed': return icons.checkCircle;
            case 'in-progress': return icons.circle;
            default: return '';
        }
    }

    // --- Funções de Anotações (V1) ---

    function saveNotes() {
        if (selectedTopic && topicNotes) {
            const topicId = selectedTopic.id;
            const notesContent = topicNotes.value;
            localStorage.setItem(`notes-${topicId}`, notesContent);
        }
    }
    
    function loadNotes(topicId) {
        return localStorage.getItem(`notes-${topicId}`) || '';
    }

    function toggleNotesArea() {
        if (!notesArea || !notesBtn) return;
        notesArea.classList.toggle('show');
        notesBtn.classList.toggle('active');
        
        if (notesArea.classList.contains('show') && topicNotes) {
            topicNotes.focus(); 
        }
    }

    // --- Funções de Vídeo (V2) ---

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.classList.remove('show');
        videoModal.setAttribute('aria-hidden','true');
        if (videoModalIframe) {
            videoModalIframe.src = '';
            videoModalIframe.style.display = 'block';
        }
        if (videoModalPlayer) {
            try { videoModalPlayer.pause(); } catch (e) {}
            videoModalPlayer.removeAttribute('src');
            videoModalPlayer.load && videoModalPlayer.load();
            videoModalPlayer.style.display = 'none';
        }
        const errorDiv = videoModal.querySelector('#iframeErrorMessage');
        if (errorDiv) { errorDiv.remove(); }
        // Não remove o overlay aqui se o topicDetail estiver aberto
        if (!topicDetail.classList.contains('show')) {
            overlay.classList.remove('show');
        }
    }

    function openLocalVideo(src, title) {
        if (!videoModalPlayer || !videoModal) {
            console.error('Local video player element not found');
            try { window.open(src, '_blank', 'noopener'); } catch (e) {}
            return;
        }

        if (videoModalIframe) {
            videoModalIframe.src = '';
            videoModalIframe.style.display = 'none';
        }
        const prevError = videoModal.querySelector('#iframeErrorMessage');
        if (prevError) prevError.remove();

        videoModalPlayer.src = src;
        videoModalPlayer.style.display = 'block';
        videoModalPlayer.pause();

        if (videoModalTitle) videoModalTitle.textContent = title || '';
        videoModal.classList.add('show');
        videoModal.setAttribute('aria-hidden','false');
        overlay.classList.add('show');
    }

    function openVideoModal(embedUrl, title, originalUrl) {
        if (!videoModal) {
            if (originalUrl) try { window.open(originalUrl, '_blank', 'noopener'); } catch (e) {}
            return;
        }

        const isLocalVideo = originalUrl && (originalUrl.match(/\.mp4(\?|$)/i) || originalUrl.startsWith('videos/') || originalUrl.startsWith('./videos/') || originalUrl.startsWith('/videos/'));
        if (isLocalVideo) {
            openLocalVideo(originalUrl, title);
            return;
        }

        const finalEmbed = normalizeEmbedUrl(embedUrl) || normalizeEmbedUrl(originalUrl) || embedUrl;

        if (!finalEmbed) {
            try { window.open(originalUrl || embedUrl, '_blank', 'noopener'); } catch (e) {}
            return;
        }

        try {
            if (!videoModalIframe) {
                try { window.open(originalUrl || embedUrl, '_blank', 'noopener'); } catch (e) {}
                return;
            }

            videoModalIframe.onload = null;
            videoModalIframe.onerror = null;
            const prevError = videoModal.querySelector('#iframeErrorMessage');
            if (prevError) prevError.remove();

            videoModalIframe.src = finalEmbed;
            videoModalIframe.style.display = 'block';
            if (videoModalPlayer) {
                videoModalPlayer.style.display = 'none';
                videoModalPlayer.src = '';
            }
            try { videoModalIframe.focus(); } catch (e) {}

        } catch (err) {
            showIframeErrorMessage(title, originalUrl);
            return;
        }

        if (videoModalTitle) videoModalTitle.textContent = title || '';
        videoModal.classList.add('show');
        videoModal.setAttribute('aria-hidden','false');
        overlay.classList.add('show');
    }

    function showIframeErrorMessage(title, youtubeUrl) {
        if (!videoModal || !videoModalIframe) return;
        
        // Esconder iframe e player local
        videoModalIframe.style.display = 'none';
        if (videoModalPlayer) {
            videoModalPlayer.style.display = 'none';
            videoModalPlayer.src = '';
        }
        
        const modalContent = videoModal.querySelector('.video-modal-content');
        if (modalContent) {
            let errorDiv = modalContent.querySelector('#iframeErrorMessage');
            const errorHtml = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #333; padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">Vídeo não pode ser exibido aqui</h2>
                    <p style="margin: 0 0 1.5rem 0; color: #666; font-size: 0.95rem;">Este vídeo tem restrições de reprodução em visualizadores incorporados.</p>
                    <p style="margin: 0 0 2rem 0; font-size: 0.9rem; color: #999;"><strong>Título:</strong> ${title || 'Vídeo'}</p>
                    <button id="openYoutubeBtn" style="padding: 0.75rem 1.5rem; font-size: 1rem; background: #FF4581; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s;">
                        Abrir no YouTube
                    </button>
                </div>
            `;

            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'iframeErrorMessage';
                const frameWrap = modalContent.querySelector('.video-frame-wrap');
                if (frameWrap) {
                    frameWrap.innerHTML = errorHtml; // Replace iframe with error message
                    const btn = frameWrap.querySelector('#openYoutubeBtn');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            try { window.open(youtubeUrl, '_blank', 'noopener'); } catch (e) {}
                            closeVideoModal();
                        });
                    }
                }
            }
        }
        videoModal.classList.add('show');
        videoModal.setAttribute('aria-hidden','false');
        overlay.classList.add('show');
    }

    function getYouTubeEmbedUrl(url) {
        try {
            const u = new URL(url);
            let id = '';
            if (u.hostname.includes('youtu.be')) {
                id = u.pathname.slice(1);
            } else if (u.hostname.includes('youtube.com') || u.hostname.includes('www.youtube.com')) {
                id = u.searchParams.get('v') || '';
            }
            if (!id) return null;
            return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`;
        } catch (e) {
            return null;
        }
    }

    function normalizeEmbedUrl(url) {
        if (!url) return null;
        try {
            const u = new URL(url);
            if (u.pathname && u.pathname.includes('/embed/')) return url;
            if (u.hostname.includes('youtu.be')) {
                const id = u.pathname.slice(1);
                return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`;
            }
            if (u.hostname.includes('youtube.com') || u.hostname.includes('www.youtube.com')) {
                const v = u.searchParams.get('v');
                if (v) return `https://www.youtube-nocookie.com/embed/${v}?modestbranding=1&rel=0`;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    // Funções do Painel de Vídeos (Video Panel) - V2
    // Mantidas, mas geralmente usadas em layouts diferentes (foram removidas do fluxo principal de showTopicDetail/handleNodeClick para simplificar o merge).
    function createVideoPanel(subtopics) {
        if (!videoPanel || !videoPanelContent) return;
        if (!subtopics || subtopics.length === 0) {
            hideVideoPanel();
            return;
        }

        const html = subtopics.map(sub => {
            const embed = normalizeEmbedUrl(sub.url) || getYouTubeEmbedUrl(sub.url) || sub.url;
            return `
                <div class="video-card">
                    <iframe src="${embed}" title="${sub.title}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="card-title">${sub.title}</div>
                </div>
            `;
        }).join('');

        videoPanelContent.innerHTML = html;
        videoPanel.classList.add('show');
        videoPanel.setAttribute('aria-hidden','false');
        roadmapContainer.style.marginLeft = '380px';
    }

    function hideVideoPanel() {
        if (!videoPanel) return;
        videoPanel.classList.remove('show');
        videoPanel.setAttribute('aria-hidden','true');
        videoPanelContent.innerHTML = '';
        roadmapContainer.style.marginLeft = '0'; // Corrigido para 0, se -10rem era a margem padrão.
    }
    
    // --- Funções Principais de DOM e Interação ---

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
    
    // Render roadmap (Expõe ao escopo global para que toggleTopic possa chamá-lo)
    window.renderRoadmap = function(isUpdate = false) { 
        // 🚨 PASSO CHAVE: Sincronizar os dados do roadmap (na memória) com o localStorage
        if (typeof roadmapData !== 'undefined' && roadmapData.topics) {
            roadmapData.topics.forEach(topic => {
                updateTopicStatus(topic); 
            });
        }
        
        const isDesktop = window.innerWidth >= 1024;
        const pathDiv = document.createElement('div');
        pathDiv.className = isDesktop ? 'roadmap-path' : 'roadmap-path-vertical';
        
        if (typeof roadmapData !== 'undefined' && roadmapData.topics) {
            roadmapData.topics.forEach((topic, index) => {
                const isLast = index === roadmapData.topics.length - 1;
                const nodeElement = createRoadmapNode(topic, index, isLast);
                pathDiv.appendChild(nodeElement);
                
                if (!isDesktop && !isLast) {
                    const verticalLine = document.createElement('div');
                    verticalLine.className = 'vertical-line';
                    pathDiv.appendChild(verticalLine);
                }
            });
        }
        
        roadmapContainer.innerHTML = ''; 
        roadmapContainer.appendChild(pathDiv);
        
        const nodeButtons = roadmapContainer.querySelectorAll('.node-button');
        nodeButtons.forEach(button => {
            button.addEventListener('click', handleNodeClick);
        });
    }

    function handleNodeClick(event) {
        const topicId = event.currentTarget.dataset.topicId;
        const topic = roadmapData.topics.find(t => t.id === topicId); 
        
        if (topic) {
            showTopicDetail(topic);
        }
    }

    function showTopicDetail(topic) {
        selectedTopic = topic;
        
        // 1. Atualizar o estado do nó
        const allNodes = document.querySelectorAll('.node-button');
        allNodes.forEach(node => node.classList.remove('active'));
        const activeNode = document.querySelector(`[data-topic-id="${topic.id}"]`);
        if (activeNode) { activeNode.classList.add('active'); }
        
        // 2. Atualizar o painel de detalhes (Título, Status)
        document.getElementById('detailTitle').textContent = topic.title;
        const statusBadge = document.getElementById('detailStatus');
        const statusMap = { 'completed': 'Concluído', 'in-progress': 'Em Progresso', 'not-started': 'Não Iniciado' };
        statusBadge.textContent = statusMap[topic.status] || 'Não Iniciado';
        statusBadge.className = `status-badge ${topic.status}`;

        // 3. Atualizar Anotações
        const notes = loadNotes(topic.id);
        if (topicNotes) topicNotes.value = notes;
        if (notesArea) notesArea.classList.remove('show');
        if (notesBtn) notesBtn.classList.remove('active');
        
        // 4. Update Description
        const descriptionDiv = document.getElementById('detailDescription');
        if (topic.description) {
            descriptionDiv.innerHTML = `<div class="section-header">${icons.bookOpen}<h3>Descrição do Tópico</h3></div><p class="section-description">${topic.description}</p>`;
            descriptionDiv.style.display = 'block';
        } else {
            descriptionDiv.style.display = 'none';
        }
        
        // 5. Update Subtopics (incluindo listeners para modal de vídeo)
        const subtopicsDiv = document.getElementById('detailSubtopics');
        if (topic.subtopics && topic.subtopics.length > 0) {
            subtopicsDiv.innerHTML = `
                <div class="section-header">${icons.bookOpen}<h3>Conteúdo Programático</h3></div>
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

            // Anexar listeners de clique para o modal de vídeo
            setTimeout(() => {
                const subLinks = subtopicsDiv.querySelectorAll('.subtopic-link');
                subLinks.forEach(link => {
                    // Remover o target='_blank' para que possamos interceptar o clique
                    link.removeAttribute('target');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const url = link.getAttribute('href');
                        const embed = normalizeEmbedUrl(url) || getYouTubeEmbedUrl(url) || url;
                        openVideoModal(embed, link.textContent.trim(), url);
                    });
                });
            }, 0);
        } else {
            subtopicsDiv.style.display = 'none';
        }
        
        // 6. Update Resources
        const resourcesDiv = document.getElementById('detailResources');
        if (topic.resources && topic.resources.length > 0) {
            resourcesDiv.innerHTML = `<div class="section-header">${icons.fileText}<h3>Recursos</h3></div><div class="resources-list">${topic.resources.map(resource => `<div class="resource-item">${icons.fileText} <span class="resource-text">${resource}</span></div>`).join('')}</div>`;
            resourcesDiv.style.display = 'block';
        } else {
            resourcesDiv.style.display = 'none';
        }

        // 7. Update Placeholder/Completion Button
        const placeholderDiv = document.getElementById('detailPlaceholder');
        if (placeholderDiv) placeholderDiv.style.display = topic.isPlaceholder ? 'block' : 'none';
        
        if (completeBtn) {
            if (topic.status === 'completed') {
                completeBtn.textContent = 'Desmarcar Conclusão';
                completeBtn.classList.add('completed');
            } else {
                completeBtn.textContent = 'Marcar como Concluído';
                completeBtn.classList.remove('completed');
            }
        }
        
        // 8. Mostrar painel
        topicDetail.classList.add('show');
        overlay.classList.add('show');
    }

    // Hide topic detail (Expõe ao escopo global para que toggleTopic possa chamá-lo)
    window.hideTopicDetail = function() {
        saveNotes();
        if (notesArea) notesArea.classList.remove('show');
        if (notesBtn) notesBtn.classList.remove('active');

        topicDetail.classList.remove('show');
        overlay.classList.remove('show');
        
        const allNodes = document.querySelectorAll('.node-button');
        allNodes.forEach(node => node.classList.remove('active'));
        
        selectedTopic = null;
        closeVideoModal();
    }

    function handleCompleteClick() {
        if (selectedTopic) {
            toggleTopic(selectedTopic.id);
        }
    }
    
    function handleHomeClick() {
        hideTopicDetail();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Inicialização e Event Listeners
    if (roadmapContainer) {
        renderRoadmap();
    } else {
        console.error("Erro: Elemento 'roadmapContainer' não encontrado.");
        return;
    }
    
    // Anexação dos Listeners (GERAL)
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', hideTopicDetail);
    if (overlay) overlay.addEventListener('click', () => {
        if (videoModal && videoModal.classList.contains('show')) {
            closeVideoModal();
        } else if (topicDetail.classList.contains('show')) {
            hideTopicDetail();
        }
    });
    if (homeBtn) homeBtn.addEventListener('click', handleHomeClick);
    if (completeBtn) completeBtn.addEventListener('click', handleCompleteClick);

    // Anexação dos Listeners (ANOTAÇÕES)
    if (notesBtn) notesBtn.addEventListener('click', toggleNotesArea);
    if (topicNotes) topicNotes.addEventListener('input', saveNotes); 
    
    // Anexação dos Listeners (VÍDEO)
    if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', closeVideoModal);
    if (closeVideoPanelBtn) closeVideoPanelBtn.addEventListener('click', hideVideoPanel); // Mantido

    // Event listeners de Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderRoadmap();
        }, 250);
    });

    // Event listeners de Teclado (Escape)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('show')) {
                closeVideoModal();
            } else if (selectedTopic) {
                hideTopicDetail();
            }
        }
    });
    
    // FIM do DOMContentLoaded
});