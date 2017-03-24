
var config = require(__dirname + "/../configurations/config.js").config;
var schemaModels = require(__dirname + "/schema/schema_models.js");

var request = require("request");



exports.createIdentity = function (req, res, next) {

    var requiredFields = ["identityCode", "identityTypeCode", "issuerCode",
        "issuerID", "issuerOrganization", "identityPayload", "attachmentURI"]
    if (!reqBody) {
        res.status(400).json({ message: "Request body cannot be empty" });
        return;
    }
    var requiredField;
    requiredFields.forEach(function (val) {
        if (!reqBody[val]) {
            requiredField = val;
        }
    });
    if (requiredField) {
        res.status(400).json({ message: `'${requiredField}' is a required field` });
        return
    }

    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.params.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length == 0) {
            res.status(404).json({ message: ` Customer doesn't exist -  '${req.param.enrollmentID}' ` });
            return
        }
        var customer = customers[0];
        var reqBody = req.body;
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}`, json: reqBody, headers: { "X-CHAINCODE-ID": customer.chainCodeID } };

        request.post(options, function (err, response, body) {
            if (err) {
                res.status(500).json({ message: "Error adding  identity to blockchain" });
                console.log(err);
                return;
            }

        });
    })

}



exports.getIdentities = function (req, res, next) {
    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.params.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length == 0) {
            res.status(404).json({ message: ` Customer doesn't exist -  '${req.param.enrollmentID}' ` });
            return
        }
        var customer = customers[0];
        var reqBody = req.body;
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}`, headers: { "X-CHAINCODE-ID": customer.chainCodeID } };

        request.get(options, function (err, response, body) {

            if (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to fetch identities for  " + req.params.enrollmentID });
            }
            res.json(body);

        })
    });
}


exports.getIdentity = function (req, res, next) {
    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.params.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length == 0) {
            res.status(404).json({ message: ` Customer doesn't exist -  '${req.param.enrollmentID}' ` });
            return
        }
        var customer = customers[0];
        var reqBody = req.body;
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}/${req.params.identityCode}`, headers: { "X-CHAINCODE-ID": customer.chainCodeID } };

        request.get(options, function (err, response, body) {

            if (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to fetch identity for  " + req.params.identityCode });
            }
            res.json(body);

        })
    })

}


exports.removeIdentity = function (req, res, next) {
    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.params.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length == 0) {
            res.status(404).json({ message: ` Customer doesn't exist -  '${req.param.enrollmentID}' ` });
            return
        }
        var customer = customers[0];
        var reqBody = req.body;
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}/${req.params.identityCode}`, headers: { "X-CHAINCODE-ID": customer.chainCodeID } };

        request.delete(options, function (err, response, body) {

            if (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to delete identity for  " + req.params.identityCode });
            }

            res.json({message : "Successfully deleted identity"});

        })
    })


