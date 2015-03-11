var model   = require("./model.js")
var fs      = require("fs");
var jade    = require("jade");
var path    = require("path");
var root    = path.resolve(__dirname + "/../");

var data = {
    months: {
        jan: [{title: "hi", content: "dog", date: "mon"}, {title: "sly", content: "frog", date: "tue"}, {title: "bye", content: "godot", date: "wed"}, {title: "chai", content: "sodot", date: "thur"}, {title: "sigh", content: "modot", date: "fri"}],

        feb: [{title: "ii", content: "dogo", date: "mono"}, {title: "slyo", content: "frogo", date: "tueo"}, {title: "byeo", content: "godo", date: "wedo"}],

        mar: [{title: "ji", content: "dogot", date: "monot"}, {title: "slyot", content: "frogot", date: "tueot"}, {title: "byeot", content: "god", date: "wedot"}]
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

exports.css = function css(req, res) {

    var fileName = root + "/css/index.css"

    fs.readFile("../lib/css/index.css", function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(contents);
    });
}

exports.invalid = function invalid(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h2>Sorry, that page doesn't exist</h2>");
}
