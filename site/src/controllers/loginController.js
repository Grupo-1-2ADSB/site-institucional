var loginModel = require("../models/loginModel");

function logar(req, res){
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if(email == undefined){
        res.status(400).send("Seu email está undefined!"); 
    } else if (senha == undefined){
        res.status(400).send("Sua senha está indefinida!");
    } else {
        loginModel
        .logar(email, senha)
        .then(function (resultado) {
            console.log(`\nResultados encontrados: ${resultado.length}`);
            console.log(`Resultados: ${JSON.stringify(resultado)}`); // transforma JSON em String

            if (resultado.length == 1) {
                console.log(resultado);
              res.json(resultado[0]);
              } else if (resultado.length == 0) {
                res.status(403).send("Email e/ou senha inválido(s)");
              } else {
                res.status(403).send("Mais de um usuário com o mesmo login e senha!");
              }
        })
        .catch(function (erro){
            console.log(erro);
            console.log(
                "\Houve um erro ao realizar o login! Erro: ", 
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
    }
}

module.exports = {
    logar
}