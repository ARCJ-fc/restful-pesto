var handler = require("./handler.js");

exports.route = function route(req, res) {

    var url = req.url;
    var router = {};
    router["/"]         	     = handler.home;
    router["/createpost"]	     = handler.createPost;
    router["/submitnewblogpost"] = handler.submitNewBlogPost;
    router["/index.css"] 	     = handler.utils;
    router["/createpost.js"]     = handler.utils;


    if (typeof router[url] === "function") {
        router[url](req, res);
    } else {
        handler.invalid(req, res);
    }
};
