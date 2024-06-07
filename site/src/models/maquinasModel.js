var database = require("../database/config");

function cadastrarMaquinas(nomeSO, versaoSO, arquiteturaSO, nomeMaquina, codigoSerialMaquina, localizacao, statusMaquina, fkUnidadeHospitalar) {
    var instrucaoSO = `
    INSERT INTO SistemaOperacional (nomeSO, versaoSO, arquiteturaSO)
    VALUES ('${nomeSO}', '${versaoSO}', '${arquiteturaSO}');
    `;

    return database.executar(instrucaoSO).then(resultSO => {
        if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
            const fkSO = resultSO.insertId;

            var instrucao = `
            INSERT INTO Computador (idComputador, nome, localizacao, statusPC, fkUnidadeHospitalar, fkSO)
            VALUES ('${codigoSerialMaquina}', '${nomeMaquina}', '${localizacao}', '${statusMaquina}', ${fkUnidadeHospitalar}, ${fkSO})
            `;

            return database.executar(instrucao);
        } else {
            const getIdentityQuery = `SELECT IDENT_CURRENT('SistemaOperacional') AS LastIdentity`;

            return database.executar(getIdentityQuery).then(resultIdentity => {
                const fkSO = resultIdentity[0].LastIdentity;

                var instrucao = `
                INSERT INTO Computador (idComputador, nome, localizacao, statusPC, fkUnidadeHospitalar, fkSO)
                VALUES ('${codigoSerialMaquina}', '${nomeMaquina}', '${localizacao}', '${statusMaquina}', ${fkUnidadeHospitalar}, ${fkSO})
                `;

                return database.executar(instrucao);
            });
        }
    });
}

function obterRegistrosDoBanco(fkUnidadeHospitalar){
    var instrucao = `SELECT 
                        r.idRegistro,
                        r.valor,
                        r.dataHora,
                        r.fkComputador,
                        r.fkHardware,
                        h.valor AS valorHardware
                    FROM 
                        Registro r
                    JOIN 
                        Computador c ON r.fkComputador = c.idComputador
                    JOIN 
                        Hardware h ON r.fkHardware = h.idHardware
                    WHERE 
                        c.fkUnidadeHospitalar = ${fkUnidadeHospitalar};`;
                        
    return database.executar(instrucao);
}



function excluirMaquinas(idMaquina, fkSOExcluir) {
    var instrucao = `DELETE FROM Computador WHERE idComputador = '${idMaquina}';`;

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

function editarInformacoesMaq(nomeSO, versaoSO, arquiteturaSO, nomeMaquina, localizacao, statusMaquina, fkUnidadeHospitalar, idComputador, fkSO) {
    var instrucao = `
        UPDATE Computador 
        SET nome = '${nomeMaquina}', 
            localizacao = '${localizacao}', 
            statusPC = '${statusMaquina}'
        WHERE idComputador = '${idComputador}';
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
    obterRegistrosDoBanco,
    editarInformacoesMaq
}