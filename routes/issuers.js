
var express = require('express');
var router = express.Router();
var issuers = require('../models/issuers.js');


router.get('/', function (req, res, next) {
    issuers.getIssuers(req, res, next);
});

router.post('/', function (req, res, next) {
    issuers.createIssuer(req, res, next);
})

router.get('/:issuerID', function (req, res, next) {
    issuers.getIssuer(req, res, next);
});

module.exports = router;



