
var express = require('express');
var router = express.Router();
var identities = require('../models/identities.js');


//Get Identities
router.get('/:enrollmentID', function (req, res, next) {
    identities.getIdentities(req, res, next);
});


//Get 
router.post('/:enrollmentID', function (req, res, next) {
    identities.createIdentity(req, res, next);
})

router.get('/:enrollmentID/:identityCode', function (req, res, next) {
    identities.getIdentity(req, res, next);
});

router.delete('/:enrollmentID/:identityCode', function (req, res, next) {
    identities.removeIdentity(req, res, next);
});

module.exports = router;



