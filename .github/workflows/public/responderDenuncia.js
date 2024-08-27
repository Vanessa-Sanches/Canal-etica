function buscarDenuncia() {
    const protocolo = document.getElementById('protocolo').value;

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
            document.getElementById('descricao').textContent = data.descricao || 'Nenhuma descrição disponível.';
            document.getElementById('denuncia-container').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Erro ao buscar a denúncia:', error);
            alert('Erro ao buscar o protocolo: ' + error.message);
        });
}

function responderDenuncia() {
    const protocolo = document.getElementById('protocolo').value;
    const resposta = document.getElementById('resposta').value;

    if (!resposta) {
        alert('Por favor, insira uma resposta.');
        return;
    }

    fetch('/responder-denuncia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            protocolo: protocolo,
            resposta: resposta
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar resposta');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('mensagem').textContent = 'Resposta enviada com sucesso!';
        document.getElementById('mensagem').classList.remove('hidden');
        document.getElementById('denuncia-container').classList.add('hidden');
    })
    .catch(error => {
        console.error('Erro ao salvar a resposta:', error);
        alert('Erro ao enviar a resposta: ' + error.message);
    });
}
