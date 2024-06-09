// routes/dadosRoute.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/obterDadosDoBanco/:fkUnidadeHospitalar', dashboardController.obterDadosDoBanco);

module.exports = router;
