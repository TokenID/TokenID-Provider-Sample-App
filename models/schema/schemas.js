let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let Issuer = new Schema({
    id: ObjectId,
    issuerID: String,
    issuerName: String,
    issuerCode: String,
    organization: String,
    enrollID: String,
    enrollSecret: String,
    createdOn: { type: Date, default: Date.now },
    updatedOn: Date
});


let Customer = new Schema({
    id: ObjectId,
    enrollmentID: String,
    enrollmentSecret: String,
    keyPair: {
        publicKey: String,
        encryptedPrivateKey: String
    },
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

let Identity = new Schema({
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

let Partner = new Schema({
    id: ObjectId,
    partnerID : String,
    name :String,
    organization : String 
})

exports.Issuer = Issuer;
exports.Customer = Customer;
exports.Identity = Identity;
exports.Partner = Partner; 