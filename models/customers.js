
var config = require(__dirname + "/../configurations/config.js").config;
var schemaModels = require(__dirname + "/schema/schema_models.js");
var ursa = require("ursa");

var request = require("request");



exports.createCustomer = function (req, res, next) {

    var requiredFields = ["title", "firstName", "lastName",
        "middleName", "email", "mobileNumber", "phoneNumber", "address", "dateOfBirth"];
    var reqBody = req.body;
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

    var enrollmentID = `CUST-${Date.now()}`;
    var keys = ursa.generatePrivateKey();
    var privPem = keys.toPrivatePem("utf8");
    var pubPem = keys.toPublicPem("utf8");


    //Find customer
    schemaModels.Customer.find({ enrollmentID: enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${enrollmentID}' ` });
            return
        }
        if (customers.length != 0) {
            res.status(400).json({ message: ` enrollmentID already exist -  '${enrollmentID}' ` });
            return
        }

        //Initiailze Customer Identity in blockchain
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${config.blockChainAPIInitializeIdentity}`, json: { providerEnrollmentID: enrollmentID, identityPublicKey: pubPem } };
        request.post(options, function (err, response, body) {
            if (err) {
                res.status(500).json({ message: "Error initialzing customer on blockchain" });
                console.log(err);
                return;
            }
            var chainCodeID = body.chaincodeID;
            if (!chainCodeID) {
                res.status(500).json({ message: "Error getting customer chaincode id" });
                console.log(body);
                return;
            }
            var reqBody = req.body;

            var identityReq = {
                "identityCode": enrollmentID,
                "identityTypeCode": "PRVMD",
                "issuerID": "PRV-000000000",
                "issuerCode": "PRV",
                "issuerOrganization": "Provider",
                "identityPayload": reqBody,
                "metaData": {},
                "attachmentURI": "https://docs.run.pivotal.io/devguide/deploy-apps/environment-variable.html"
            }

            var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}`, json: identityReq, headers: { "X-CHAINCODE-ID": chainCodeID } };

            request.post(options, function (err, response, body) {
                if (err) {
                    res.status(500).json({ message: "Error adding  identity to blockchain" });
                    console.log(err);
                    return;
                }

                var customer = new schemaModels.Customer({});

                customer.enrollmentID = enrollmentID;
                customer.enrollmentSecret = (Math.random() * 10000000000000000).toString(16);
                customer.chainCodeID = chainCodeID;
                customer.keyPair = { publicKey: pubPem, encryptedPrivateKey: new Buffer(privPem).toString('base64') }; //Using base64 to simulate encryption
                customer.mundane = reqBody;
                customer.save(function (err, customer) {
                    if (err) {
                        res.status(500).json({ message: "Error saving customer " });
                        console.log(err);
                        return;
                    }
                    res.json({ message: "Customer succesfully enrolled", enrollmentID: enrollmentID })

                });

            });

        });
    })

}




exports.getCustomers = function (req, res, next) {
    schemaModels.Customer.find().select("id enrollmentID keyPair.publicKey chainCodeID mundane createdOn lastUpdatedOn").exec(function (err, customers) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch customers" });
        }
        res.json(customers);
    });
}


exports.getCustomer = function (req, res, next) {
    schemaModels.Customer.findOne().where("customerID").equals(req.params.customerID).exec(function (err, customer) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch customer " + req.params.customerID });
        }
        res.json(customer);
    })
}

