var maquinasModel = require("../models/maquinasModel");

function cadastrarMaquinas(req, res){
    let hostname = req.body.hostnameServer;
    let ip = req.body.ipServer;
    let os = req.body.osServer;

    limparMensagensErro();

    if(hostname.value == "" || hostname.value.length < 4){
        mensagensErro[0].textContent = "*Preencha o campo com 4 caracteres, no mínimo.";
        return false;
    } else if (ip.value == "" || ip.value.length < 15 ){
        mensagensErro[1].textContent = "*Preencha o campo com 15 caracteres, no mínimo."
        return false;
    } else if(os.value == "" || os.value.length < 5){
        mensagensErro[2].textContent = "*Preencha o campo com 5 caracteres, no mínimo."
        return false;
    } 
}

function obterMaquinasDoBanco(req, res){
    maquinasModel.obterMaquinasDoBanco()
        .then(function(maquinas){
            res.json(maquinas);
    })
        .catch(function (erro){
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