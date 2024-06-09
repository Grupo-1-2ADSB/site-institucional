// routes/dadosRoute.js
const express = require('express');
const router = express.Router();
const dadosController = require('../controllers/dadosController');

router.get('/obterDadosDoBanco/:fkUnidadeHospitalar', dadosController.obterDadosDoBanco);

module.exports = router;
