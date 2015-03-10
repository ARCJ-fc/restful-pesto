var http = require("http");
var handler = require("./handler");
var port = 4000;
var app = http.createServer(handler);

var routes = {}
routes["/"] = 

    
    
app.listen(port);

console.log('Server running on port', port);