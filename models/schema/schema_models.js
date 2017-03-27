

var config  = require(__dirname +  "/../../configurations/config.js" ).config;

var mongoose = require('mongoose');
mongoose.connect(config.mongoDatabaseUrl);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var IssuerSchema = new Schema({
    id: ObjectId,
    issuerID: String,
    issuerName: String,
    issuerCode: String,
    organization: String,
    enrollID: String,
    enrollSecret: String,
    identityTypeCodes: { type: Array, default: [] },
    createdOn: { type: Date, default: Date.now },
    updatedOn: Date
});


var CustomerSchema = new Schema({
    id: ObjectId,
    enrollmentID: String,
    enrollmentSecret: String,
    keyPair: {
        publicKey: String,
        encryptedPrivateKey: String
    },
    chainCodeID : String,
    mundane: {
        title: String,
        firstName: String,
        lastName: String,
        middleName: String,
        mobileNumber: String,
        phoneNumber: String,
        email: String,
        address: String,
        address2: String,
        dateOfBirth: Date,
        nextOfKins: { type: Array, default: [] }
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: Date

})

var IdentitySchema = new Schema({
    id: ObjectId,
    providerEnrollmentID : String,
    identityCode : String,
    identityTypeCode :  String,
    issuerCode : String,
    issuerID : String,
    issuerOrganization : String,
    identityPayload : Object,
    metaData: Object,
    attachmentURI : String,
    createdOn: { type: Date, default: Date.now },
    updatedOn: Date,
    createdBy: String,
    lastUpdatedBy : String
    
})

var PartnerSchema = new Schema({
    id: ObjectId,
    partnerID : String,
    name :String,
    organization : String,
    email : String,
    webHookUrl:String
})

exports.Issuer = mongoose.model("Issuer", IssuerSchema);
exports.Customer = mongoose.model("Customer",CustomerSchema);
exports.Identity = mongoose.model("Identity", IdentitySchema);
exports.Partner = mongoose.model("Partner",  PartnerSchema); 