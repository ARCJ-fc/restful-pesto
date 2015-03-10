var handler = require("./handler.js");
var path = require("path");


exports.router = function route(req, res) {  
    
    var url = req.url;
    var router = {};
    router["/"]         = handler.home;
    router["/index.css"] = handler.css;
    
    
    if (typeof router[url] === "function") {
        console.log("is a function")
        router[url](req, res);
    } else {
        console.log("uh oh");
        handler.invalid(req, res);
    }
}
