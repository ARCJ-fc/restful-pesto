var fs = require("fs");


module.exports = function handler(req, res) {

	if (req.url === "/") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end();
	} else if (req.url === "/posts") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end();
	} else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.end("<h1>You're in the wrong part of town, boy</h1>");
	}

};
