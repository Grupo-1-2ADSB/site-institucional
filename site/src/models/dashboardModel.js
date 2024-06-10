// models/dashboardModel.js
var database = require("../database/config");

async function obterDadosDoBanco(fkUnidadeHospitalar) {
    console.log(`Acessei o dashboardModel.js, executei obterDadosDoBanco()`);
    var instrucao = `SELECT valor FROM registro WHERE fkUnidadeHospitalar = "${fkUnidadeHospitalar}" ORDER BY dataHora DESC LIMIT 1;`;
    
    try {
        const [rows, fields] = await database.execute(instrucao);
        return rows;
    } catch (error) {
        console.error('Erro ao obter dados do banco:', error);
        throw error;
    }
}

function obterQtdDisco(idComputador) {
    var instrucao = `SELECT fkComputador, COUNT(*) AS quantidade_armazenamento
    FROM Hardware
    WHERE nomeHardware LIKE '%Armazenamento%' AND fkComputador = '${idComputador}'
    GROUP BY fkComputador;`;

    return database.executar(instrucao);
}

module.exports = {
    obterDadosDoBanco,
    obterQtdDisco
};