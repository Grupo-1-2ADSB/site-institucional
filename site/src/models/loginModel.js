var database = require("../database/config");

function logar(nameUser, senha){
    console.log(`Acessei o loginMogel.js, executei logar(${nameUser},${senha})`);
    
    var instrucao = `SELECT * FROM usuario WHERE nomeUser = ${nameUser} AND senha = ${senha};`;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    logar
}