var handler = require("./handler.js");
var path = require("path");


exports.route = function route(req, res) {  
    
    var url = req.url;
    var router = {};
    router["/"]         = handler.home;
    router["/css/index.css"] = handler.css;
    
    
    if (typeof router[url] === "function") {
        console.log("is a function")
        router[url](req, res);
    } else {
        console.log("uh oh");
        handler.invalid(req, res);
    }
}
