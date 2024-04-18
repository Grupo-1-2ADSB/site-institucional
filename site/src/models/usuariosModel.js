var database = require("../database/config");

function cadastrarUsuario(nomeCompleto, username, email, senha, fkCargo) {
    var instrucao = `INSERT INTO usuario (nomeCompleto, username, email, senha, fkCargo) VALUES ('${nomeCompleto}', '${username}', '${email}', '${senha}', '${fkCargo}');`;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarUsuario
};