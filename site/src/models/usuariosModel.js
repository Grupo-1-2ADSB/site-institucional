var database = require("../database/config");

function cadastrarUsuario(nomeCompleto, username, email, senha, cargo) {
    var instrucao = `INSERT INTO usuario (nomeCompleto, username, email, senha, cidadeMora, paisMora) VALUES ('${nomeCompleto}', '${username}', '${email}', '${senha}', '${cargo}');`;

    return database.executar(instrucao);
}