// controllers/dadosController.js
const dashboardModel = require('../models/dashboardModel');

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

function obterQtdDisco(req, res) {
    const idComputador = req.params.idComputador;

    dashboardModel.obterQtdDisco(idComputador)
        .then(function (qtdDisco) {
            res.json(qtdDisco);
        }).catch(function (erro) {
            console.error("Erro ao obter qtdDisco:", erro);
            res.status(500).json({ error: "Erro ao obter qtdDisco." })
        })
}

function obterInfoMaquina(req, res) {
    const idComputador = req.params.idComputador;

    dashboardModel.obterInfoMaquina(idComputador)
        .then(function (idComputador) {
            res.json(idComputador);
        }).catch(function (erro) {
            console.error("Erro ao obter informações do computador:", erro);
            res.status(500).json({ error: "Erro ao obter informações do computador." })
        })
}

module.exports = {
    obterDadosDoBanco,
    obterQtdDisco,
    obterInfoMaquina
};
