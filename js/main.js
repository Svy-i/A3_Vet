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