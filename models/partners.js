const config = require(__dirname + "/../configurations/config.js").config;
const schemaModels = require(__dirname + "/../schema/schema_models.js");

let request = require("request");



exports.createPartner = function (req, res, next) {
    let reqBody = req.body;
    let requiredFields = ["name", "organization", "email", "webHookUrl"]
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

    reqBody.partnerID = `PAR-${Date.now()}`;

    let partner = new schemaModels.Partner(reqBody);
    issuer.save(function (err, partner) {
        if (err) {
            res.status(500).json({ message: "Error registering relyinh partner" });
            console.log(err);
            return;
        }
        res.json({ message: "Partner succesfully enrolled", partnerID: reqBody.partnerID });

    })


}



exports.getPartners = function (req, res, next) {
    schemaModels.Partner.find().exec(function (err, partners) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch relying partners" });
        }
        res.json(partners)
    });
}


exports.getPartner = function (req, res, next) {
    schemaModels.Partner.findOne().where("partnerID").equals(req.params.partnerID).exec(function (err, partner) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch relying partner " + req.params.partnerID });
        }
        res.json(partner);
    })
}


