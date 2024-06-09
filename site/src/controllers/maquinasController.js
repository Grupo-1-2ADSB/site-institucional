var maquinasModel = require("../models/maquinasModel");

function cadastrarMaquinas(req, res) {
    const {
        soServer: nomeSO,
        versaoSOServer: versaoSO,
        arquiteturaSOServer: arquiteturaSO,
        nomeMaquinaServer: nomeMaquina,
        codigoSerialMaquinaServer: codigoSerialMaquina,
        localizacaoServer: localizacao,
        statusMaquinaServer: statusMaquina,
        fkUnidadeHospitalarServer: fkUnidadeHospitalar
    } = req.body;

    if (
        !nomeSO ||
        !versaoSO ||
        !arquiteturaSO ||
        !nomeMaquina ||
        !codigoSerialMaquina ||
        !localizacao ||
        !statusMaquina ||
        !fkUnidadeHospitalar
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    maquinasModel.cadastrarMaquinas(nomeSO, versaoSO, arquiteturaSO, nomeMaquina, codigoSerialMaquina, localizacao, statusMaquina, fkUnidadeHospitalar)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            if (erro.code === 'ER_DUP_ENTRY' || (erro.message && erro.message.includes('Violation of PRIMARY KEY constraint'))) {
                return res.status(400).json({ message: `Duplicate entry: ${codigoSerialMaquina}` });
            } else {
                console.error("Houve um erro ao realizar o cadastro: ", erro);
                res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
            }
        });
}

function obterMaquinasDoBanco(req, res) {
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;
    maquinasModel.obterMaquinasDoBanco(fkUnidadeHospitalar)
        .then(function (maquinas) {
            res.json(maquinas);
        }).catch(function (erro) {
            console.error("Erro ao obter maquinas:", erro);
            res.status(500).json({ error: "Erro ao obter maquinas." })
        })
}

function obterRegistrosDoBanco(req, res) {
    console.log("Acessei o maquinasController, e executei obterRegistrosDoBanco");
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;
    maquinasModel.obterRegistrosDoBanco(fkUnidadeHospitalar)
        .then(function (registros) {
            res.json(registros);
        }).catch(function (erro) {
            console.error("Erro ao obter registros:", erro);
            res.status(500).json({ error: "Erro ao obter registros." })
        })
}


function obter7RegistrosDoBanco(req, res) {
    console.log("Acessei o maquinasController, e executei obter7RegistrosDoBanco");
    const fkUnidadeHospitalar = req.params.fkUnidadeHospitalar;
    const idComputador = req.params.idComputador;

    console.log("Parametos" + idComputador)

    maquinasModel.obter7RegistrosDoBanco(fkUnidadeHospitalar, idComputador)
        .then(function (registros) {
            res.json(registros);
        }).catch(function (erro) {
            console.error("Erro ao obter registros:", erro);
            res.status(500).json({ error: "Erro ao obter registros." })
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
        }).catch(function (erro) {
            console.error("Houve um erro ao excluir maquinas: ", erro);
            res.status(500).json({ error: "Houve um erro ao excluir maquinas." });
        });
}

function editarInformacoesMaq(req, res) {
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

    maquinasModel.editarInformacoesMaq(nomeSO, versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar, idComputador, fkSO)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.error("Houve um erro ao realizar as alterações!: ", erro);
            res.status(500).json({ error: "Houve um erro ao realizar as alterações!" });
        });
}

module.exports = {
    cadastrarMaquinas,
    obterMaquinasDoBanco,
    excluirMaquinas,
    obterRegistrosDoBanco,
    obter7RegistrosDoBanco,
    editarInformacoesMaq
}