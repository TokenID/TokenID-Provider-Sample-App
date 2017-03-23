const config = require(__dirname + "/../configurations/config.js").config;
const schemaModels = require(__dirname + "/../schema/schema_models.js");

let request = require("request");



exports.createIssuer = function (req, res, next) {

    let requiredFields = ["identityCode", "identityTypeCode", "issuerCode",
        "issuerID", "issuerOrganization", "identityPayload", "attachmentURI"]
    if (!reqBody) {
        res.status(400).json({ message: "Request body cannot be empty" });
        return;
    }
    let requiredField;
    requiredFields.forEach(function (val) {
        if (!reqBody[val]) {
            requiredField = val;
        }
    })
    if (requiredField) {
        res.status(400).json({ message: `'${requiredField}' is a required field` });
        return
    }

    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.param.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length == 0) {
            res.status(404).json({ message: ` Customer deosnt exist -  '${req.param.enrollmentID}' ` });
            return
        }
        let customer = customers[0];
        let reqBody = req.body;
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.param.enrollmentID}`, json: reqBody, headers : { "X-CHAINCODE-ID" : customer.chainCodeID}};

        request.post(options, function (err, response, body) {
            if (err) {
                res.status(500).json({ message: "Error adding  identity to blockchain" });
                console.log(err);
                return;
            }

        });
    })

}



exports.getIssuers = function (req, res, next) {
    schemaModels.Issuer.find().select("id issuerID issuerName issuerOrganization createdOn").exec(function (err, issuers) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch issuers" });
        }
        res.json(issuers)
    });
}


exports.getIssuer = function (req, res, next) {
    schemaModels.Issuer.findOne().where("issuerID").equals(req.params.issuerID).exec(function (err, issuer) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch issuer " + req.params.issuerID });
        }
        res.json(issuer);
    })
}


