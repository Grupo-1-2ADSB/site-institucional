var database = require("../database/config");

function cadastrarAlertas(gravidade, descricao, fkRegistro) {
    var instrucao = `INSERT INTO Evento values ('${gravidade}', '${descricao}', ${fkRegistro});`;

    return database.executar(instrucao);
}

function obterAlertasDoBanco(fkUnidadeHospitalar) {
    var instrucao = `SELECT * FROM Evento JOIN Registro ON Evento.fkRegistro = Registro.idRegistro 
    JOIN Computador ON Registro.fkComputador = Computador.idComputador
    JOIN Hardware ON Registro.fkHardware = Hardware.idHardware
    WHERE fkUnidadeHospitalar = ${fkUnidadeHospitalar};`;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarAlertas,
    obterAlertasDoBanco
}