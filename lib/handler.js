var fs = require("fs");

function home(req, res) {
    fs.readFile("index.html", function(err, contents) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(contents);
    });
}

function css(req, res) {
    fs.readFile(__dirname + req.url, function(err, contents) {
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

