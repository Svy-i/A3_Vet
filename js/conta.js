document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Coleta os valores de TODOS os campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    
    const messageElement = document.getElementById('message');

    // 2. Validação Simples de E-mail
    // Expressão regular básica para verificar o formato: algo@algo.algo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!emailRegex.test(email)) {
        messageElement.textContent = 'Por favor, insira um endereço de e-mail válido.';
        messageElement.className = 'error-message';
        return; // Impede o restante da execução
    }

    // 3. Simulação de Registro Bem-Sucedido
    // Em um sistema real, você enviaria esses dados para um servidor aqui (via Fetch/Axios)
    
    messageElement.textContent = 'Cadastro realizado com sucesso!';
    messageElement.className = 'success-message';
    
    // Exibe os dados coletados no console do navegador para fins de demonstração
    console.log('--- Novo Usuário Registrado ---');
    console.log('Nome:', name);
    console.log('E-mail:', email);
    console.log('Senha (simulada):', password); 
    console.log('Data de Nascimento:', dob);
    console.log('Gênero Selecionado:', gender);
    console.log('------------------------------');

    // Limpa a mensagem de sucesso após 4 segundos
    setTimeout(() => {
        messageElement.textContent = '';
    }, 4000);
});