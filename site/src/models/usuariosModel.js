var database = require("../database/config");

function cadastrarUsuario(nomeCompleto, nomeUser, email, senha, fkCargo) {
    var instrucao = `INSERT INTO Usuario (nomeCompleto, nomeUser, email, senha, fkCargo) VALUES ('${nomeCompleto}', '${nomeUser}', '${email}', '${senha}', '${fkCargo}');`;

    return database.executar(instrucao);
}

function excluirUsuario(valueUsuario) {
    var instrucao = `DELETE FROM Usuario WHERE idUsuario = ${valueUsuario};`;

    return database.executar(instrucao);
}

function obterUsuariosDoBanco() {
    var instrucao = `SELECT idUsuario, nomeCompleto FROM Usuario;`;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarUsuario,
    excluirUsuario,
    obterUsuariosDoBanco
};