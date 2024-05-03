var express = require("express");
var router = express.Router();

var usuariosController = require("../controllers/usuariosController");

router.post("/cadastrarUsuario", function (req, res) {
    usuariosController.cadastrarUsuario(req, res);
});

router.delete("/excluirUsuario", function(req, res) {
    usuariosController.excluirUsuario(req, res);
});

router.get("/obterUsuariosDoBanco/:fkUnidadeHospitalar", function(req, res) {
    usuariosController.obterUsuariosDoBanco(req, res);
});

router.put("/trocarInformacoesUser/:idUsuario", function (req, res) {
    usuariosController.trocarInformacoesUser(req, res);
})

router.get("/exibirCargos", function (req, res){
    usuariosController.exibirCargos(req, res);
})

module.exports = router;