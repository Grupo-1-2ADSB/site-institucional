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

function excluirMaquinas(idMaquina, fkSOExcluir) {
    var instrucao = `DELETE FROM Computador WHERE idComputador = ${idMaquina};`;

    return database.executar(instrucao).then(() => {
        var instrucaoSO = `
        DELETE FROM SistemaOperacional WHERE idSO = ${fkSOExcluir};
        `;

        return database.executar(instrucaoSO);
    });
}

function obterMaquinasDoBanco(fkUnidadeHospitalar) {
    var instrucao = `SELECT * FROM computador JOIN sistemaOperacional ON fkSO = idSO WHERE fkUnidadeHospitalar = ${fkUnidadeHospitalar};`;

    return database.executar(instrucao);
}

function editarInformacoesMaq(nomeSO,versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar, idComputador, fkSO) {
    var instrucao = `
        UPDATE Computador 
        SET nome = '${nomeMaquina}', 
            localizacao = '${localizacao}', 
            statusPC = '${statusMaquina}'
        WHERE idComputador = ${idComputador};
    `;

    return database.executar(instrucao).then(result => {
        var instrucaoSO = `
            UPDATE SistemaOperacional
            SET nomeSO = '${nomeSO}',
                versaoSO = '${versaoSO}',
                arquiteturaSO = '${arquiteturaSO}'
            WHERE idSO = ${fkSO};
        `;

        return database.executar(instrucaoSO);
    });
}

module.exports = {
    cadastrarMaquinas,
    excluirMaquinas,
    obterMaquinasDoBanco,
    editarInformacoesMaq
}