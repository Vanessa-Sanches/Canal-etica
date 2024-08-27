const express = require('express');
const fs = require('fs');
const path = require('path');
const sendEmail = require('./sendEmail'); 

const app = express();
app.use(express.json());

const denunciasFilePath = path.join(__dirname, 'denuncias.json');

// Servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do primeiro site
app.use('/public/index.html', express.static(path.join(__dirname, 'site1')));

// Configuração do segundo site
app.use('/public/responderDenuncia.html', express.static(path.join(__dirname, 'site2')));

// Rota padrão
app.get('/', (req, res) => {
  res.send('/public/index.html');
});

// Rota para buscar denúncia por protocolo
app.get('/buscar-denuncia', (req, res) => {
    const protocolo = req.query.protocolo;

    try {
        console.log(`Buscando denúncia para o protocolo: ${protocolo}`);
        const denuncias = JSON.parse(fs.readFileSync(denunciasFilePath, 'utf-8'));
        const denuncia = denuncias.find(d => d.protocolo === protocolo);

        if (denuncia) {
            console.log('Denúncia encontrada:', denuncia);
            res.status(200).json(denuncia);
        } else {
            console.log('Protocolo não encontrado.');
            res.status(404).send('Protocolo não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar denúncia:', error);
        res.status(500).send('Erro ao buscar denúncia.');
    }
});

// Rota para responder denúncia
app.post('/responder-denuncia', (req, res) => {
    const { protocolo, resposta } = req.body;

    try {
        console.log(`Salvando resposta para o protocolo: ${protocolo}`);
        let denuncias = [];
        if (fs.existsSync(denunciasFilePath)) {
            denuncias = JSON.parse(fs.readFileSync(denunciasFilePath, 'utf-8'));
        }

        const denuncia = denuncias.find(d => d.protocolo === protocolo);
        if (denuncia) {
            denuncia.resposta = resposta;
            fs.writeFileSync(denunciasFilePath, JSON.stringify(denuncias, null, 2), 'utf-8');
            console.log('Resposta salva com sucesso:', resposta);
            res.status(200).send('Resposta salva com sucesso.');
        } else {
            console.log('Protocolo não encontrado.');
            res.status(404).send('Protocolo não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao salvar a resposta:', error);
        res.status(500).send('Erro ao salvar a resposta.');
    }
});

// Rota para salvar a denúncia com o protocolo
app.post('/send-protocol', async (req, res) => {
    const {
        nome, cpf, celular, email, colaborador,
        descricao, testemunhas, evidencias, protocolo, isIdentified
    } = req.body;

    console.log('Recebido para salvar:', req.body);

    try {
        // Enviar o e-mail para o responsável
        await sendEmail({
            nome,
            cpf,
            celular,
            email: 'compliance@unimed-dracena.com.br',  // Enviar para o responsável
            colaborador,
            descricao,
            protocolo,
            testemunhas,
            evidencias,
            destinatario: 'compliance@unimed-dracena.com.br'  // Destinatário fixo
        });
        console.log('E-mail enviado para o responsável.');

        // Enviar o e-mail para o denunciante, se ele se identificou
        if (isIdentified && email) {
            console.log('Usuário optou por se identificar. Enviando e-mail para o denunciante...');
            await sendEmail({
                nome,
                cpf,
                celular,
                email,  // E-mail do denunciante
                colaborador,
                descricao,
                protocolo,
                testemunhas,
                evidencias,
                destinatario: email  // E-mail do denunciante
            });
            console.log('E-mail enviado para o denunciante.');
        }

        // Verifica se o arquivo denuncias.json existe
        if (!fs.existsSync(denunciasFilePath)) {
            console.log('Arquivo denuncias.json não encontrado. Criando novo arquivo.');
            fs.writeFileSync(denunciasFilePath, '[]');  // Cria o arquivo com um array vazio
        }

        // Carregar denúncias existentes
        let denuncias = JSON.parse(fs.readFileSync(denunciasFilePath, 'utf-8'));

        // Adicionar nova denúncia ao array
        denuncias.push(req.body);
        console.log('Denúncia adicionada:', req.body);

        // Salvar o array atualizado no arquivo JSON
        fs.writeFileSync(denunciasFilePath, JSON.stringify(denuncias, null, 2), 'utf-8');
        console.log('Denúncia salva com sucesso no arquivo');

        res.status(200).send('Denúncia realizada com sucesso.');
    } catch (error) {
        console.error('Erro ao gerar protocolo:', error);
        res.status(500).send('Erro ao gerar protocolo.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

