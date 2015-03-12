var model       = require("./model.js")
var fs          = require("fs");
var jade        = require("jade");
var path        = require("path");
var querystring = require("querystring");

var root    = path.resolve(__dirname + "/../");

var extensions      = {};
extensions[".css"]  = ["css", "text/css"];
extensions[".js"]   = ["js", "text/javascript"];
extensions[".png"]  = ["assets", "image/png"];


var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    data.now = exports.getMonthString(now);

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
        req.post.date = new Date();
        var thisMonth = exports.getMonthString(req.post.date);
        model.writeToDB(thisMonth, res, req.post, function(res) {
            res.writeHead(201, {"Content-Type": "text/javascript"});
            res.end("/");
        });
    })
}

exports.utils = function utils(req, res) {

    var ext = path.extname(req.url);

    if (!extensions[ext]) {
        console.log("File not found!");
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>File not found m8</h1>");
        return false;
    }

    var fileName = root + "/lib/" + extensions[ext][0] + "/" + req.url;

    fs.readFile(fileName, function(err, contents) {
        res.writeHead(200, {"Content-Type": extensions[ext][1]});
        res.end(contents);
    });
}

exports.invalid = function invalid(req, res) {

    var now = new Date();
    data.now = exports.getMonthString(now);

    var fileName = root + "/lib/404Page.jade";

    model.readFromDB(data.now, res, data, function(res) {
        var fn = jade.compileFile(fileName, {fileName: "404Page.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fn(data));
    });
}


// Utility functions

exports.getMonthString = function getMonthString(date) {
    return months[date.getMonth()] || false;
}