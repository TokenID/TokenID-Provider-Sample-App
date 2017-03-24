
let express = require('express');
let router = express.Router();
let customers = require('../models/customers.js');


router.get('/:enrollmentID', function (req, res, next) {
    customers.getCustomer(req, res, next);
});

router.get('/', function (req, res, next) {
    customers.getCustomers(req, res, next);
});


router.post('/', function (req, res, next) {
    customers.createCustomer(req, res, next);
})


module.exports = router;



