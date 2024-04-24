var database = require("../database/config");

function cadastrarUsuario(nomeCompleto, nomeUser, email, senha, fkCargo) {
    var instrucao = `INSERT INTO Usuario (nomeCompleto, nomeUser, email, senha, fkCargo) VALUES ('${nomeCompleto}', '${nomeUser}', '${email}', '${senha}', '${fkCargo}');`;

    return database.executar(instrucao);
}

function excluirUsuario(valueUsuario) {
    var instrucao = `DELETE FROM Usuario WHERE valueUsuario = ${valueUsuario};`;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarUsuario,
    excluirUsuario
};