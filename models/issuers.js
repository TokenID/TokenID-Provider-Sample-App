const config  = require(__dirname +  "/../configurations/config.js" ).config;
const schemaModels = require(__dirname + "/../schema/schema_models.js");

let request = require("request"); 



exports.createIssuer =  function (req,res,next)
{
    let reqBody = req.body;
    let requiredFields = ["enrollID", "issuerCode", "issuerName", "issuerOrganization", "identityTypeCodes"]
    if(!reqBody)
    {
        res.status(400).json({ message : "Request body cannot be empty"});
        return;
    }
    requiredFields.forEach(function(val){
        if(!reqBody[val]){
            res.status(400).json({ message : `'${val}' is a required field`});
            return
        }
    })

    if(reqBody.identityTypeCodes.length == 0)
    {
         res.status(400).json({ message : "At least one Identity Type Code needed "});
        return;
    }

    reqBody.issuerID  = `ECB-${Date.now()}`;
    

    request.post(`${config.blockChainAPI}/${config.blockChainAPIIssuer}`, reqBody,  function(err,response, body ) {
        if(err){
            res.status(500).json({ message : "Error registering issuer to blockchain"});
            console.log(err);
            return;
        }
        let issuer = new schemaModels.Issuer(reqBody);
        issuer.save(function(err, issuer){
            if(err)
            {
                res.status(500).json({ message : "Error registering issuer to blockchain"});
                console.log(err);
                return;
            }
            res.json({message : "Issuer succesfully enrolled"})

        })

    });
}



exports.getIssuer = function(req, res, next)
{
    
}


