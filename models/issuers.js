const config = require(__dirname + "/../configurations/config.js").config;
const schemaModels = require(__dirname + "/../schema/schema_models.js");

let request = require("request");



exports.createIssuer = function (req, res, next) {
    let reqBody = req.body;
    let requiredFields = ["enrollID", "issuerCode", "issuerName", "issuerOrganization", "identityTypeCodes"]
    if (!reqBody) {
        res.status(400).json({ message: "Request body cannot be empty" });
        return;
    }
    let requiredField;
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
        if (err) {
            res.status(500).json({ message: "Error registering issuer to blockchain" });
            console.log(err);
            return;
        }
        let issuer = new schemaModels.Issuer(reqBody);
        issuer.save(function (err, issuer) {
            if (err) {
                res.status(500).json({ message: "Error registering issuer to blockchain" });
                console.log(err);
                return;
            }
            res.json({ message: "Issuer succesfully enrolled", credentials: body })

        })

    });
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


