const config  = require(__dirname +  "/../configurations/config.js" ).config;

let request = require("request");


exports.createIssuer =  function (req,res,next)
{
    let reqBody = req.body;
    if(!reqBody)
    {
        res.status(400).json({ message : "Request body cannnot be empty"});
        return;
    }

    request.post(`${config.blockChainAPI}/${config.blockChainAPIIssuer}`, function(err,response, body ) {
        if(err){

        }
    })
}
