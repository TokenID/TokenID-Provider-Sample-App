
let express = require('express');
let router = express.Router();
let partners = require('../models/partners.js');


router.get('/:partnerID', function (req, res, next) {
    partners.getPartner(req, res, next);
});

router.get('/', function (req, res, next) {
    partners.getPartners(req, res, next);
});


router.post('/', function (req, res, next) {
    partners.createPartner(req, res, next);
})


module.exports = router;



