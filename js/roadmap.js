// Application state
let selectedTopic = null;

// DOM Elements
const roadmapContainer = document.getElementById('roadmapContainer');
const topicDetail = document.getElementById('topicDetail');
const overlay = document.getElementById('overlay');
const closeDetailBtn = document.getElementById('closeDetail');
const homeBtn = document.getElementById('homeBtn');

// Icons as SVG strings
const icons = {
    checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="node-icon">
        <circle cx="12" cy="12" r="10"></circle>
    </svg>`,
    bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon icon-pink">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>`,
    fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>`
};

// Get status icon
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

// Create roadmap node
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
                                <span>${subtopic}</span>
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
function renderRoadmap() {
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
    const topic = roadmapData.topics.find(t => t.id === topicId);
    
    if (topic) {
        showTopicDetail(topic);
    }
}

// Show topic detail
function showTopicDetail(topic) {
    selectedTopic = topic;
    
    // Update active state on nodes
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
                        <span class="subtopic-detail-text">${subtopic}</span>
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
    
    // Show/hide placeholder message
    const placeholderDiv = document.getElementById('detailPlaceholder');
    if (topic.isPlaceholder) {
        placeholderDiv.style.display = 'block';
    } else {
        placeholderDiv.style.display = 'none';
    }
    
    // Show the detail panel
    topicDetail.classList.add('show');
    overlay.classList.add('show');
}

// Hide topic detail
function hideTopicDetail() {
    topicDetail.classList.remove('show');
    overlay.classList.remove('show');
    
    // Remove active state from all nodes
    const allNodes = document.querySelectorAll('.node-button');
    allNodes.forEach(node => node.classList.remove('active'));
    
    selectedTopic = null;
}

// Handle home button click
function handleHomeClick() {
    hideTopicDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners
closeDetailBtn.addEventListener('click', hideTopicDetail);
overlay.addEventListener('click', hideTopicDetail);
homeBtn.addEventListener('click', handleHomeClick);

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        renderRoadmap();
    }, 250);
});

// Handle ESC key to close detail
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selectedTopic) {
        hideTopicDetail();
    }
});

// Initialize
renderRoadmap();
