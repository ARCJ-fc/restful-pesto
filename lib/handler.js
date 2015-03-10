var fs = require("fs");

function home(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end();
}





function invalid(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("<h2>Sorry, that page doesn't exist</h2>");
}


module.exports = {
    home: home
};

