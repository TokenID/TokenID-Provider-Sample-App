

var config = require(__dirname + "/../configurations/config.js").config;
var schemaModels = require(__dirname + "/schema/schema_models.js");

var request = require("request");



exports.createPartner = function (req, res, next) {
    var reqBody = req.body;
    var requiredFields = ["name", "organization", "email", "webHookUrl"]
    if (!reqBody) {
        res.status(400).json({ message: "Request body cannot be empty" });
        return;
    }
    var requiredField;
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

    var partner = new schemaModels.Partner(reqBody);
    partner.save(function (err, partner) {
        if (err) {
            res.status(500).json({ message: "Error registering relying partner" });
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


