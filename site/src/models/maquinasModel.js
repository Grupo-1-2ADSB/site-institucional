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
    console.log(`Acessei o maquinasModel.js, executei obterRegistrosDoBanco()`);
    var instrucao = `SELECT 
                        r.idRegistro,
                        r.valor,
                        r.dataHora,
                        h.nomeHardware,
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
                        c.fkUnidadeHospitalar = ${fkUnidadeHospitalar}
                        AND CONVERT(date, r.dataHora) = CONVERT(date, GETDATE());`;
                        
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function obter7RegistrosDoBanco(fkUnidadeHospitalar, idComputador){
    console.log(`Acessei o maquinasModel.js, executei obterRegistrosDoBanco()`);
    var instrucao;

    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
       instrucao = `SELECT 
        r.idRegistro,
        r.valor,
        r.dataHora,
        h.nomeHardware,
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
        c.fkUnidadeHospitalar = ${fkUnidadeHospitalar} AND
        c.idComputador = '${idComputador}'
    ORDER BY 
        r.dataHora DESC
    LIMIT 7;`;
    } else {
        instrucao = `
        SELECT idRegistro, valor, dataHora, nomeHardware, fkComputador, fkHardware, valorHardware
FROM (
    SELECT 
        r.idRegistro,
        r.valor,
        r.dataHora,
        h.nomeHardware,
        r.fkComputador,
        r.fkHardware,
        h.valor AS valorHardware,
        ROW_NUMBER() OVER (PARTITION BY h.nomeHardware ORDER BY CASE WHEN h.nomeHardware = 'Armazenamento' THEN r.dataHora END DESC, r.dataHora DESC) AS RowNum
    FROM 
        Registro r
    JOIN 
        Computador c ON r.fkComputador = c.idComputador
    JOIN 
        Hardware h ON r.fkHardware = h.idHardware
    WHERE 
        c.fkUnidadeHospitalar = ${fkUnidadeHospitalar} AND c.idComputador = '${idComputador}'
) AS SubQuery
WHERE 
    (nomeHardware = 'Armazenamento' AND RowNum = 1) OR (nomeHardware <> 'Armazenamento' AND RowNum <= 7);
        `;
    }
                        
    console.log("Executando a instrução SQL: \n" + instrucao);
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
    obter7RegistrosDoBanco,
    editarInformacoesMaq
}