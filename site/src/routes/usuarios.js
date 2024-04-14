var express = require("express");
var router = express.Router();

var usuariosController = require("../controllers/usuariosController");

router.post("/cadastrarUsuario", function (req, res) {
    usuariosController.cadastrarUsuario(req, res);
});

module.exports = router;