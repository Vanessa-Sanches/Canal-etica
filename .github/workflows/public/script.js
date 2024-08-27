function toggleIdentification(isIdentified) {
    const requiredFields = ['nome', 'cpf', 'celular', 'email'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (isIdentified) {
            field.setAttribute('required', 'required');
        } else {
            field.removeAttribute('required');
        }
    });
}

function showForm(type) {
    document.getElementById('form-relato').classList.add('hidden');
    document.getElementById('complaint-form-step1').classList.add('hidden');
    document.getElementById('complaint-form-step2').classList.add('hidden');
    document.getElementById('protocol-message').classList.add('hidden');

    if (type === 'relato') {
        document.getElementById('form-relato').classList.remove('hidden');
    } else if (type === 'denuncia') {
        document.getElementById('complaint-form-step1').classList.remove('hidden');
    } else if (type === 'complaint-form-step1') {
        document.getElementById('complaint-form-step1').classList.remove('hidden');
    } else if (type === 'complaint-form-step2') {
        document.getElementById('complaint-form-step2').classList.remove('hidden');
    }
}

function validateStep1() {
    const identifyRadio = document.querySelector('input[name="identify"]:checked');
    
    if (!identifyRadio) {
        alert('Por favor, escolha se você gostaria de se identificar.');
        return;
    }

    const isIdentified = identifyRadio.value === 'yes';
    
    if (isIdentified) {
        const email = document.getElementById('email').value;
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const celular = document.getElementById('celular').value;

        if (!email || !nome || !cpf || !celular) {
            alert('Por favor, preencha todos os campos.');
            document.getElementById('email').focus();
            document.getElementById('nome').focus();
            document.getElementById('cpf').focus();
            document.getElementById('celular').focus();
            return;
        }
    }

    showForm('complaint-form-step2');
}

function generateProtocol() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const celular = document.getElementById('celular').value;
    const email = document.getElementById('email').value;
    const colaborador = document.getElementById('colaborador').value;
    const descricao = document.getElementById('descricao').value;
    const testemunhas = document.getElementById('testemunhas').value;
    const evidencias = document.getElementById('evidencias').value;

    const identifyRadio = document.querySelector('input[name="identify"]:checked');
    const isIdentified = identifyRadio && identifyRadio.value === 'yes';

    if (isIdentified) {
        if (!nome || !cpf || !celular || !email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    }

    const protocol = 'PROTOCOLO-' + new Date().getTime();
    saveProtocol(nome, cpf, celular, email, colaborador, descricao, testemunhas, evidencias, protocol, isIdentified);
    displayProtocol(protocol);
}

function saveProtocol(nome, cpf, celular, email, colaborador, descricao, testemunhas, evidencias, protocol, isIdentified) {
    fetch('/send-protocol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            cpf: cpf,
            celular: celular,
            email: email,
            colaborador: colaborador,
            descricao: descricao,
            testemunhas: testemunhas,
            evidencias: evidencias,
            protocolo: protocol,
            isIdentified: isIdentified // Inclui a informação se o usuário se identificou ou não
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar protocolo');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Erro ao salvar protocolo:', error);
        alert('Erro ao enviar protocolo: ' + error.message);
    });
}

function displayProtocol(protocol) {
    const protocolMessage = document.getElementById('protocol-message');
    protocolMessage.textContent = 'Seu número de protocolo é: ' + protocol;
    protocolMessage.classList.remove('hidden');
}
