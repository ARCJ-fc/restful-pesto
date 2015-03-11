var model   = require("./model.js")
var fs      = require("fs");
var jade    = require("jade");
var path    = require("path");
var root    = path.resolve(__dirname + "/../");
var querystring = require("querystring");

var data = {
    now     : new Date(),
    months  : {
        January     : [],
        February    : [],
        March       : [],
        April       : [],
        May         : [],
        June        : [],
        July        : [],
        August      : [],
        September   : [],
        October     : [],
        November    : [],
        December    : []
    }
};

exports.home = function home(req, res) {

    var now = new Date();
    data.now = model.getMonthString(now);

    var fileName = root + "/lib/index.jade";

    model.readFromDB(data.now, res, data, function(res) {
        var fn = jade.compileFile(fileName, {fileName: "index.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fn(data));
    });
}

exports.createPost = function createPost(req, res) {

    var fileName = root + "/lib/createPost.jade"

    var fn = jade.compileFile(fileName, {fileName: "newPost.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fn(data));
}

exports.submitNewBlogPost = function submitNewBlogPost(req, res) {
    var queryData = "";
    req.on("data", function(data) {
        queryData += data;
    })
    req.on("end", function() {
        req.post = querystring.parse(queryData);

        console.log(req.post);
        req.post.date = new Date();
        var thisMonth = model.getMonthString(req.post.date);
        model.writeToDB(thisMonth, res, req.data);
    })
}

exports.css = function css(req, res) {

    var fileName = root + "/lib/css/index.css"

    fs.readFile(fileName, function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(contents);
    });
}

exports.js = function js(req, res) {
    var fileName = root + "/lib/createpost.js";

    fs.readFile(fileName, function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.end(contents);
    });
}

exports.invalid = function invalid(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h2>Sorry, that page doesn't exist</h2>");
}
