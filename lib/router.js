var handler = require("./handler.js");

exports.route = function route(req, res) {

    var url = req.url;
    var router = {};
    router["/"]         	     = handler.home;
    router["/loginpage"]         = handler.loginPage;
    router["/createpost"]        = handler.createPost;
    router["/submitnewblogpost"] = handler.submitNewBlogPost;
    router["/logmein"]           = handler.logMeIn;
    router["/loginsuccess"]      = handler.loginSuccess;
    router["/index.css"]         = handler.utils;
    router["/createpost.js"]     = handler.utils;
    router["/loginpage.js"]      = handler.utils;
    router["/loginsuccess.js"]   = handler.utils;


    if (typeof router[url] === "function") {
        router[url](req, res);
    } else {
        handler.invalid(req, res);
    }
};
