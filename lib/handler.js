var model = require("./model.js")
var fs      = require("fs");
var jade    = require("jade");
var path    = require("path");
var root    = path.resolve(__dirname + "/../"); 

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

    var fileName    = root + "/lib/index.jade"

    var fn = jade.compileFile(fileName, {fileName: "index.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});    
        res.end(fn(data));
}

function createPost(req, res) {

    var fileName = root + "/lib/createPost.jade"

    var fn = jade.compileFile(fileName, {fileName: "newPost.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});    
        res.end(fn(data));    
}

function css(req, res) {

    var fileName = root + "/css/index.css"

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

