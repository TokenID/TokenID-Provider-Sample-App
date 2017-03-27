
var config = require(__dirname + "/../configurations/config.js").config;
var schemaModels = require(__dirname + "/schema/schema_models.js");

var request = require("request");



exports.createIssuer = function (req, res, next) {
    var reqBody = req.body;
    var requiredFields = ["enrollID", "issuerCode", "issuerName", "organization", "identityTypeCodes"]
    if (!reqBody) {
        res.status(400).json({ message: "Request body cannot be empty" });
        return;
    }
    var requiredField;
    requiredFields.forEach(function (val) {
        if (!reqBody[val]) {
            requiredField  =  val;
        }
    })
    if(requiredField)
    {
        res.status(400).json({ message: `'${requiredField}' is a required field` });
        return
    }

    if (reqBody.identityTypeCodes.length == 0) {
        res.status(400).json({ message: "At least one Identity Type Code needed " });
        return;
    }

    reqBody.issuerID = `ISS-${Date.now()}`;


    request.post({ uri: `${config.blockChainAPI}/${config.blockChainAPIIssuer}`, json: reqBody }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(500).json({ message: "Error registering issuer to blockchain" });
            console.log(body);
            console.log(err);
            return;
        }
        var issuer = new schemaModels.Issuer(reqBody);
        issuer.save(function (err, issuer) {
            if (err) {
                res.status(500).json({ message: "Error registering issuer to blockchain" });
                console.log(err);
                return;
            }
            res.json({ message: "Issuer succesfully enrolled",issuerID  : reqBody.issuerID,  credentials: body })

        })

    });
}



exports.getIssuers = function (req, res, next) {
    schemaModels.Issuer.find().select("id issuerID issuerName issuerCode enrollID organization identityTypeCodes createdOn lastUpdatedOn").exec(function (err, issuers) {
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


