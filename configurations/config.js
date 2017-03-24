
var fs = require("fs");


var config = {};

try{
config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));
}
catch(ex)
{
    console.log("Could not load config file");
    console.error(ex);
}
exports.config = config;
