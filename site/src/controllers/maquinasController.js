var maquinasModel = require("../models/maquinasModel");

function cadastrarMaquinas(req, res){
    const {
        soServer: nomeSO,
        versaoSOServer: versaoSO,
        arquiteturaSOServer: arquiteturaSO,
        nomeMaquinaServer: nomeMaquina,
        localizacaoServer: localizacao,
        statusMaquinaServer: statusMaquina,
        fkUnidadeHospitalarServer: fkUnidadeHospitalar
    } = req.body;

    if (
        !nomeSO ||
        !versaoSO ||
        !arquiteturaSO ||
        !nomeMaquina ||
        !localizacao ||
        !statusMaquina ||
        !fkUnidadeHospitalar
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    maquinasModel.cadastrarMaquinas(nomeSO,versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao realizar o cadastro: ", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro."});
        });
  
}

function obterMaquinasDoBanco(req, res){
    maquinasModel.obterMaquinasDoBanco()
        .then(function(maquinas){
            res.json(maquinas);
        }).catch(function (erro){
            console.error("Erro ao obter maquinas:", erro);
            res.status(500).json({error: "Erro ao obter maquinas."})
        })
}

function excluirMaquinas(req, res) {
    const valueMaquinas = req.body.valueMaquinasServer; 

    if (!valueMaquinas) {
        return res.status(400).json({ error: "valueMaquinas está null." });
    }

    maquinasModel.excluirMaquinas(valueMaquinas)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao excluir maquinas: ", erro);
            res.status(500).json({ error: "Houve um erro ao excluir maquinas."});
        });  
}

module.exports = {
    cadastrarMaquinas,
    obterMaquinasDoBanco,
    excluirMaquinas
}