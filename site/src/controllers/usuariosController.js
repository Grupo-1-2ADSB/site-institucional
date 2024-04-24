var usuariosModel = require("../models/usuariosModel");

function cadastrarUsuario(req, res) {
    const {
        nomeServer: nomeCompleto,
        nomeUserServer: nomeUser,
        emailServer: email,
        senhaServer: senha,
        fkCargoServer: fkCargo
    } = req.body;


    if (
        !nomeCompleto ||
        !nomeUser ||
        !email ||
        !senha ||
        !fkCargo
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    usuariosModel.cadastrarUsuario(nomeCompleto, nomeUser, email, senha, fkCargo)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao realizar o cadastro: ", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro."});
        });
} 

function excluirUsuario(req, res) {
    const idUsuario = req.body.idUsuarioServer; 

    if (!idUsuario) {
        return res.status(400).json({ error: "IdUsuario está null." });
    }

    usuariosModel.excluirUsuario(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao excluir usuário: ", erro);
            res.status(500).json({ error: "Houve um erro ao excluir usuário."});
        });  
}


module.exports = {
    cadastrarUsuario,
    excluirUsuario
}