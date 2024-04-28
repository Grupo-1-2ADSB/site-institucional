var database = require("../database/config");

function cadastrarMaquinas(){
    
}

function excluirMaquinas(valueMaquinas) {
    var instrucao = `DELETE FROM ----- WHERE ---------- = ${valueMaquinas};`;

    return database.executar(instrucao);
}

function obterMaquinasDoBanco() {
    var instrucao = ``;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarMaquinas,
    excluirMaquinas,
    obterMaquinasDoBanco
}