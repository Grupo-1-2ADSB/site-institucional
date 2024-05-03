var database = require("../database/config");

function cadastrarMaquinas(nomeSO,versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar){
    var instrucaoSO = `
    INSERT INTO SistemaOperacional (nomeSO, versaoSO, arquiteturaSO)
    VALUES ('${nomeSO}', '${versaoSO}', '${arquiteturaSO}');
    `;

    return database.executar(instrucaoSO).then(resultSO => {
        const fkSO = resultSO.insertId;

        var instrucao = `
        INSERT INTO Computador (nome, localizacao, statusPC, fkUnidadeHospitalar, fkSO)
        VALUES ('${nomeMaquina}', '${localizacao}', '${statusMaquina}', ${fkUnidadeHospitalar} ,${fkSO})
        `;

        return database.executar(instrucao);

    });
}

function excluirMaquinas(valueMaquinas) {
    var instrucao = `DELETE FROM ----- WHERE ---------- = ${valueMaquinas};`;

    return database.executar(instrucao);
}

function obterMaquinasDoBanco(fkUnidadeHospitalar) {
    var instrucao = `SELECT * FROM computador JOIN sistemaOperacional ON fkSO = idSO WHERE fkUnidadeHospitalar = ${fkUnidadeHospitalar};`;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarMaquinas,
    excluirMaquinas,
    obterMaquinasDoBanco
}