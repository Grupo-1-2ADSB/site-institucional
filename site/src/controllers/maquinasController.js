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
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;
    maquinasModel.obterMaquinasDoBanco(fkUnidadeHospitalar)
        .then(function(maquinas){
            res.json(maquinas);
        }).catch(function (erro){
            console.error("Erro ao obter maquinas:", erro);
            res.status(500).json({error: "Erro ao obter maquinas."})
        })
    }


function excluirMaquinas(req, res) {
    const idMaquina = req.body.idMaquinaServer; 
    const fkSOExcluir = req.body.fkSOServer;

    if (!idMaquina) {
        return res.status(400).json({ error: "idMaquina está null." });
    } else if (!fkSOExcluir) {
        return res.status(400).json({ error: "fkSO está null." });
    }

    maquinasModel.excluirMaquinas(idMaquina, fkSOExcluir)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao excluir maquinas: ", erro);
            res.status(500).json({ error: "Houve um erro ao excluir maquinas."});
        });  
}

function editarInformacoesMaq(req, res){
    const {
        soServer: nomeSO,
        versaoSOServer: versaoSO,
        arquiteturaSOServer: arquiteturaSO,
        nomeMaquinaServer: nomeMaquina,
        localizacaoServer: localizacao,
        statusMaquinaServer: statusMaquina,
        fkUnidadeHospitalarServer: fkUnidadeHospitalar,
        idComputadorServer: idComputador,
        fkSOServer: fkSO
    } = req.body;

    if (
        !nomeSO ||
        !versaoSO ||
        !arquiteturaSO ||
        !nomeMaquina ||
        !localizacao ||
        !statusMaquina ||
        !fkUnidadeHospitalar ||
        !idComputador ||
        !fkSO
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    maquinasModel.editarInformacoesMaq(nomeSO,versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar, idComputador, fkSO)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao realizar as alterações!: ", erro);
            res.status(500).json({ error: "Houve um erro ao realizar as alterações!"});
        });
}

module.exports = {
    cadastrarMaquinas,
    obterMaquinasDoBanco,
    excluirMaquinas,
    editarInformacoesMaq
}