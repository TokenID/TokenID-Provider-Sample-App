const config  = require(__dirname +  "/../configurations/config.js" ).config;

let request = require("request");



exports.createIssuer =  function (req,res,next)
{
    let reqBody = req.body;
    let requiredFields = ["enrollID","issuerID", "issuerCode", "issuerName", "issuerOrganization", "identityTypeCodes"]
    if(!reqBody)
    {
        res.status(400).json({ message : "Request body cannot be empty"});
        return;
    }
    requiredFields.forEach(function(val){
        if(!reqBody["val"]){
            res.status(400).json({ message : `'${val}' is a required field`});
            return
        }
    })
    if(reqBody.identityTypeCodes.length == 0)
    {
         res.status(400).json({ message : "At least one Identity Type Code needed "});
        return;
    }

    request.post(`${config.blockChainAPI}/${config.blockChainAPIIssuer}`, function(err,response, body ) {
        if(err){

        }
    })
}
