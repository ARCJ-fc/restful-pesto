var http    = require("http");
var router  = require("./router.js");
var port    = 4001;
var app     = http.createServer(router.route);
    
app.listen(port);

console.log('Server running on port', port);