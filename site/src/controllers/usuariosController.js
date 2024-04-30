var usuariosModel = require("../models/usuariosModel");

function cadastrarUsuario(req, res) {
    const {
        nomeServer: nomeCompleto,
        nomeUserServer: nomeUser,
        emailServer: email,
        senhaServer: senha,
        fkUnidadeHospitalarServer: fkUnidadeHospitalar,
        fkCargoServer: fkCargo
    } = req.body;


    if (
        !nomeCompleto ||
        !nomeUser ||
        !email ||
        !senha ||
        !fkUnidadeHospitalar||
        !fkCargo
    ) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    usuariosModel.cadastrarUsuario(nomeCompleto, nomeUser, email, senha, fkUnidadeHospitalar, fkCargo)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao realizar o cadastro: ", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro."});
        });
} 

function excluirUsuario(req, res) {
    const valueUsuario = req.body.valueUsuarioServer; 

    if (!valueUsuario) {
        return res.status(400).json({ error: "valueUsuario está null." });
    }

    usuariosModel.excluirUsuario(valueUsuario)
        .then(function (resultado) {
            res.json(resultado);
        }).catch (function (erro) {
            console.error("Houve um erro ao excluir usuário: ", erro);
            res.status(500).json({ error: "Houve um erro ao excluir usuário."});
        });  
}

function obterUsuariosDoBanco(req, res) {
    usuariosModel.obterUsuariosDoBanco()
        .then(function (usuarios) {
            res.json(usuarios);
        }).catch (function (erro) {
            console.error("Erro ao obter usuários:", erro);
            res.status(500).json({ error: "Erro ao obter usuários."});
        });  
}

function trocarInformacoesUser(req, res) {
    const idUsuario = req.params.idUsuario;
    const {
        novoUsernameServer: novoUsername,
        novoEmailServer: novoEmail,
        novaSenhaServer: novaSenha
    } = req.body;

    if (idUsuario == undefined) {
        res.status(400).send("O id está undefined!");
    } else {
        usuariosModel.trocarInformacoesUser(idUsuario, novoUsername, novoEmail, novaSenha)
            .then(function (resultado) {
                if (resultado) {
                    res.json(resultado);
                } else {
                    res.status(404).send("Usuário não encontrado ou informações não puderam ser atualizadas.");
                }
            })
            .catch(function (erro) {
                console.error("Erro ao tentar atualizar informações do usuário:", erro);
                res.status(500).send("Houve um erro interno ao tentar atualizar informações do usuário.");
            });
    }
}

function exibirCargos(){

}


module.exports = {
    cadastrarUsuario,
    excluirUsuario,
    obterUsuariosDoBanco,
    trocarInformacoesUser,
    exibirCargos
}