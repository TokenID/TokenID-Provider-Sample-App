
var config = require(__dirname + "/../configurations/config.js").config;
var schemaModels = require(__dirname + "/schema/schema_models.js");
var ursa = require("ursa");

var request = require("request");



exports.createCustomer = function (req, res, next) {

    var requiredFields = ["title", "firstName", "lastName",
        "middleName", "email", "mobileNumber", "phoneNumber", "address", "address2", "dateOfBirth"]
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
    var privPem = keys.toPublicPem("base64");
    var pubPem = keys.toPublicPem("base64");


    //Find customer
    schemaModels.Customer.find({ enrollmentID: req.params.enrollmentID }).select("enrollmentID chainCodeID").exec(function (err, customers) {

        if (!err) {
            console.log(err);
            res.status(500).json({ message: ` Could not get customer  '${req.param.enrollmentID}' ` });
            return
        }
        if (customers.length != 0) {
            res.status(400).json({ message: ` enrollmentID already exist -  '${req.param.enrollmentID}' ` });
            return
        }

        //Initiailze Customer Identity in blockchain
        var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${config.blockChainAPIInitializeIdentity}`, json: { enrollmentID: enrollmentID, publicKey: pubPem } };
        request.post(options, function (err, response, body) {
            if (err) {
                res.status(500).json({ message: "Error initialzing customer on blockchain" });
                console.log(err);
                return;
            }
            var chainCodeID = body.chainCodeID;

            var reqBody = req.body;

            var options = { uri: `${config.blockChainAPI}/${config.blockChainAPIIdentity}/${req.params.enrollmentID}`, json: reqBody, headers: { "X-CHAINCODE-ID": chainCodeID } };

            request.post(options, function (err, response, body) {
                if (err) {
                    res.status(500).json({ message: "Error adding  identity to blockchain" });
                    console.log(err);
                    return;
                }

                var customer = new schemaModels.Customer({});

                customer.enrollmentID = enrollmentID;
                customer.enrollmentSecret = (Math.random() * 10000000000000000).toString(16);
                customer.chainCodeID = body.chainCodeID;
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


exports.getCustomer = function (req, res, next) {
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


