var handler = require("./handler.js");

var router = {};
router["/"] = handler.home;


function route(req, res) {    
    var url = req.url;
    if (typeof router[url] === "function") {
    router[url](req, res);
    } else {
    handler.invalid(req, res);
    }
}

module.exports = route;