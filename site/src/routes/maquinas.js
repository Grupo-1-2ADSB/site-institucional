var express = require ("express");
var router = express.Router();

var maquinasController = require("../controllers/maquinasController");

router.post("/cadastrarMaquinas", function (req, res){
    maquinasController.cadastrarMaquinas(req, res);
});

router.get("/obterMaquinasDoBanco" , function(req, res){
    maquinasController.obterMaquinasDoBanco(req, res);
});

router.delete("/excluirMaquinas", function(req, res) {
    maquinasController.excluirMaquinas(req, res);
});

module.exports = router;