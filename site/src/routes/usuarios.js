var express = require("express");
var router = express.Router();

var usuariosController = require("../controllers/usuariosController");

router.post("/cadastrarUsuario", function (req, res) {
    usuariosController.cadastrarUsuario(req, res);
});

router.delete("/excluirUsuario", function(req, res) {
    usuariosController.excluirUsuario(req, res);
});

router.get("/obterUsuariosDoBanco", function(req, res) {
    usuariosController.obterUsuariosDoBanco(req, res);
});

module.exports = router;