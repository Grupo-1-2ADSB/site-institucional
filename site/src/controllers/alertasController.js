var alertasModel = require("../models/alertasModel");

function cadastrarAlertas(req, res) {
    const {
        gravidadeServer: gravidade,
        descricaoServer: descricao,
        fkRegistroServer: fkRegistro
    } = req.body;


    if (
        !gravidade ||
        !descricao ||
        !fkRegistro
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser informados." });
    }

    alertasModel.cadastrarAlertas(gravidade, descricao, fkRegistro) 
    .then(function (resultado) {
        res.json(resultado);
    }).catch(function (erro) {
        console.error("Houve um erro ao inserir o alerta!: ", erro);
        res.status(500).json({ error: "Houve um erro ao inserir o alerta!" });
    });
}

function obterAlertasDoBanco(req, res) {
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;

    if (fkUnidadeHospitalar == undefined) {
        res.status(400).send("O id está undefined!");
    } else {
    alertasModel.obterAlertasDoBanco(fkUnidadeHospitalar)
        .then(function (alertas) {
            res.json(alertas);
        }).catch (function (erro) {
            console.error("Erro ao obter alertas:", erro);
            res.status(500).json({ error: "Erro ao obter alertas."});
        });  
    }
}

module.exports = {
    cadastrarAlertas,
    obterAlertasDoBanco
}