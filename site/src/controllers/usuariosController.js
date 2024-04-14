var usuariosModel = require("../models/usuariosModel");

async function cadastrarUsuario(req, res) {
    try {
        const {
            nomeServer: nomeCompleto,
            usernameServer: username,
            emailServer: email,
            senhaServer: senha,
            cargoServer
        } = req.body;

        const cargo = cargoServer || "Gerente";

        if (
            !nomeCompleto ||
            !username ||
            !email ||
            !senha ||
            !cargo
        ) {
            throw new Error("Todos os campos devem ser preenchidos.");
        }

        const resultado = await usuariosModel.cadastrarUsuario(nomeCompleto, username, email, senha, cargo);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
    }
}

module.exports = {
    cadastrarUsuario
}