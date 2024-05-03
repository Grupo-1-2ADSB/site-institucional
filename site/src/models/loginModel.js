var database = require("../database/config");

function logar(email, senha){    
    var instrucao = `SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    logar
}