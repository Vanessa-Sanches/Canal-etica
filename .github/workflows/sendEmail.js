require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail({ nome, cpf, celular, email, protocolo, colaborador, descricao, testemunhas, evidencias, destinatario }) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Credenciais de email não configuradas. Verifique o arquivo .env");
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail', // Usando o serviço Gmail para simplificação
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use a senha de app do Gmail, não a senha normal
        }
    });

    let mailOptions = {
        from: `"Compliance" <${process.env.EMAIL_USER}>`, // O campo "from" deve corresponder ao email autenticado
        to: destinatario,  // Destinatário dinâmico
        subject: destinatario === email ? 'Protocolo de Denúncia' : 'Nova Denúncia Recebida',
        text: `
Uma nova denúncia foi registrada com as seguintes informações:

Nome: ${nome || 'Não informado'}
CPF: ${cpf || 'Não informado'}
Celular: ${celular || 'Não informado'}
Email: ${email || 'Não informado'}
Colaborador: ${colaborador || 'Não informado'}
Descrição: ${descricao || 'Não informado'}
Testemunhas: ${testemunhas || 'Não informado'}
Evidências: ${evidencias || 'Não informado'}
Protocolo: ${protocolo || 'Não informado'}

Atenciosamente,
UNIMED DRACENA Canal de Ética
        `
    };

    console.log(`Enviando e-mail para: ${destinatario}`);
    console.log(`Conteúdo do e-mail:\n${mailOptions.text}`);

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado para: ${destinatario}`);
    } catch (error) {
        console.error(`Erro ao enviar email para ${destinatario}: `, error);
        throw error;
    }
}

module.exports = sendEmail;
