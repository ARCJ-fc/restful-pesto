var fs = require("fs");
var jade = require("jade");

var data = {
    months: {
        jan: [{title: "hi", content: "dog", date: "mon"}, {title: "sly", content: "frog", date: "tue"}, {title: "bye", content: "godot", date: "wed"}, {title: "chai", content: "sodot", date: "thur"}, {title: "sigh", content: "modot", date: "fri"}],
        
        feb: [{title: "ii", content: "dogo", date: "mono"}, {title: "slyo", content: "frogo", date: "tueo"}, {title: "byeo", content: "godo", date: "wedo"}],
        
        mar: [{title: "ji", content: "dogot", date: "monot"}, {title: "slyot", content: "frogot", date: "tueot"}, {title: "byeot", content: "god", date: "wedot"}]
    }
}

function home(req, res) {
    var fn = jade.compileFile("./index.jade", {fileName: "index.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});    
        res.end(fn(data));
}

function css(req, res) {
    fs.readFile("./css/index.css", function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(contents);
    });
}

function invalid(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h2>Sorry, that page doesn't exist</h2>");
}

module.exports = {
    home    : home,
    css     : css,
    invalid : invalid
};

