var express = require ("express");

var router = express.Router();

var loginController = require("../controllers/");

router.post("/logar", function(req, res){
    loginController.logar(req, res);
});

module.exports = router;