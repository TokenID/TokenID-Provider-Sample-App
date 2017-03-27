
var express = require('express');
var router = express.Router();
var idaas = require('../utils/idaas.js');
var util = require('../utils/util.js');
var schemaModels = require(__dirname + "../models/schema/schema_models.js");

exports.validateCredentials = function (req, res, next) {

    var session = req.session;

    //Generating token for valid login
    if (session.loginToken) {
        res.json({ message: "Already Logged In.." })
    }

    schemaModels.Customer.find({ enrollmentID: req.id }).select("enrollmentSecret").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: "Could not validate credentials" });
            return;
        }

        if (customers.length == 0) {
            res.status(401).json({ message: "invalid credentials" });
            return;
        }
        var customer = customers[0];
        if (req.secret != customer.enrollmentSecret) {
            res.status(401).json({ message: "invalid credentials" });
            return;
        }
        session.loginToken = util.randomHexString();
        res.json({ message: "Successfully Logged In" });
    });

    

}

exports.

