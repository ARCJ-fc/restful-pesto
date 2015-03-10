var http    = require("http");
var router  = require("./router.js");
var port    = 4000;
var app     = http.createServer(router);
    
app.listen(port);

console.log('Server running on port', port);