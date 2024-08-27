function consultarResposta() {
    const protocolo = document.getElementById('search-protocol').value;

    if (!protocolo) {
        alert('Por favor, insira um número de protocolo.');
        return;
    }

    fetch(`/buscar-denuncia?protocolo=${protocolo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Protocolo não encontrado');
            }
            return response.json();
        })
        .then(data => {
            exibirResposta(data);
        })
        .catch(error => {
            console.error('Erro ao buscar o protocolo:', error);
            alert('Erro ao buscar o protocolo: ' + error.message);
        });
}

function exibirResposta(data) {
    const responseContainer = document.getElementById('response-container');
    responseContainer.innerHTML = `
        <h3>Denúncia: ${data.descricao}</h3>
        <p><strong>Resposta:</strong> ${data.resposta || 'Ainda não há resposta para esta denúncia.'}</p>
    `;
    responseContainer.classList.remove('hidden');
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