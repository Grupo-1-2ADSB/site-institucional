function obterUsuariosDoBanco(fkUnidadeHospitalar) {
    var instrucao = `SELECT idUsuario, nomeCompleto FROM Usuario WHERE fkUnidadeHospitalar = ${fkUnidadeHospitalar};`;

    return database.executar(instrucao);
}

function excluirUsuario(valueUsuario) {
    var instrucao = `DELETE FROM Usuario WHERE idUsuario = ${valueUsuario};`;

    return database.executar(instrucao);
}