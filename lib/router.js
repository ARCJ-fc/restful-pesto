var handler = require("./handler.js");
var path = require("path");


exports.route = function route(req, res) {  
    
    var url = req.url;
    var router = {};
    router["/"]         	= handler.home;
    router["/createpost"]	= handler.createPost;
    router["/index.css"] 	= handler.css;
    
    
    if (typeof router[url] === "function") {
        router[url](req, res);
    } else {
        handler.invalid(req, res);
    }
};
