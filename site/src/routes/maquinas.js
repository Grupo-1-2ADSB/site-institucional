var express = require ("express");
var router = express.Router();

var maquinasController = require("../controllers/maquinasController");

router.post("/cadastrarMaquinas", function (req, res){
    maquinasController.cadastrarMaquinas(req, res);
});

router.get("/obterMaquinasDoBanco/:fkUnidadeHospitalar", function(req, res){
    maquinasController.obterMaquinasDoBanco(req, res);
});

router.get("/obterRegistrosDoBanco/:fkUnidadeHospitalar", function(req, res){
    maquinasController.obterRegistrosDoBanco(req, res);
})

router.get("/obter7RegistrosDoBanco/:fkUnidadeHospitalar", function(req, res){
    maquinasController.obter7RegistrosDoBanco(req, res);
})

router.delete("/excluirMaquinas", function(req, res) {
    maquinasController.excluirMaquinas(req, res);
});

router.put("/editarInformacoesMaq", function(req, res) {
    maquinasController.editarInformacoesMaq(req, res);
});

module.exports = router;