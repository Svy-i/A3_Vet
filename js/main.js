const body = document.body;
const toggleCheckbox = document.getElementById('dark-mode-toggle');

function applyMode(isDarkMode) {
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleCheckbox.checked = true;
        localStorage.setItem('mode', 'dark');
    } else {
        body.classList.remove('dark-mode');
        toggleCheckbox.checked = false;
         localStorage.setItem('mode', 'light');
        }
    }

const savedMode = localStorage.getItem('mode');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedMode === 'dark' || (!savedMode && prefersDark)) {
    applyMode(true);
} else {
    applyMode(false);
}

toggleCheckbox.addEventListener('change', (event) => {
applyMode(event.currentTarget.checked);
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('button-name-input');
    const createBtn = document.getElementById('create-button-btn');
    const container = document.getElementById('buttons-container');

    createBtn.addEventListener('click', () => {
        let buttonName = input.value.trim();

        if (buttonName === "") {
            alert("Por favor, digite um nome para o botão.");
            return;
        }

        const newButton = document.createElement('button');
        
        newButton.textContent = buttonName;
        
        newButton.addEventListener('click', () => {
            alert(`Você clicou no botão: ${buttonName}`);
        });

        container.appendChild(newButton);

        input.value = '';
        input.focus(); 
    });
});

createBtn.addEventListener('click', () => {
    let buttonName = input.value.trim();
    if (buttonName === "") {
        alert("Por favor, digite um nome para o botão.");
        return;
    }

    const newButtonLink = document.createElement('a');
    const pageFileName = `${buttonName.toLowerCase().replace(/\s/g, '_')}.html`;
    newButtonLink.href = pageFileName;

    newButtonLink.textContent = buttonName;

    newButtonLink.classList.add('created-button-style');

    container.appendChild(newButtonLink);

    input.value = '';
    input.focus(); 
});