var fs = require("fs");
var jade = require("jade");
var model = require("./model.js")

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

function home(req, res) {
    
    var now = new Date();
    data.now = model.getMonthString(now);
    
    data.months[data.now] = model.readFromDB(data.now);

    var fn = jade.compileFile("../lib/index.jade", {fileName: "index.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});    
        res.end(fn(data));
}

function createPost(req, res) {

    var fn = jade.compileFile("../lib/createPost.jade", {fileName: "newPost.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});    
        res.end(fn(data));    
}

function css(req, res) {
    
    fs.readFile("../lib/css/index.css", function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(contents);
    });
}

function invalid(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h2>Sorry, that page doesn't exist</h2>");
}

module.exports = {
    home        : home,
    createPost  : createPost,
    css         : css,
    invalid     : invalid
};

