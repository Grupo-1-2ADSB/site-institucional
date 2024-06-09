// controllers/dadosController.js
const dadosModel = require('../models/dashboardModel');

async function obterDadosDoBanco(req, res) {
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;

    try {
        // Chama o modelo para obter os dados do banco
        const dados = await dadosModel.obterDadosDoBanco(fkUnidadeHospitalar);
        res.json(dados);
    } catch (error) {
        console.error('Erro ao obter dados do banco:', error);
        res.status(500).json({ error: 'Erro ao obter dados do banco' });
    }
}

module.exports = {
    obterDadosDoBanco
};
