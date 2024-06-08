var express = require ("express");

var router = express.Router();

var alertasController = require("../controllers/alertasController");

router.post("/cadastrarAlertas", function(req, res){
    alertasController.cadastrarAlertas(req, res);
});

router.get("/obterAlertasDoBanco/:fkUnidadeHospitalar", function(req, res) {
    alertasController.obterAlertasDoBanco(req, res);
});

module.exports = router;