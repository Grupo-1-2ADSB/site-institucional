// routes/dadosRoute.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/obterDadosDoBanco/:fkUnidadeHospitalar/:idComputador', dashboardController.obterDadosDoBanco);

router.get('/obterQtdDisco/:idComputador', function(req, res) {
    dashboardController.obterQtdDisco(req, res);
});


module.exports = router;
