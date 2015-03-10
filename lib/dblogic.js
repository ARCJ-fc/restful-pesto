// Require mongoose and other node modules \\
var server = require("./server.js")
var mongoose = require("mongoose");
var http = require("http");
var url = require("url");
var fs = require("fs");
var mongodbUri = require('mongodb-uri');

// define mongolab creentials, format for mongoose and connect \\
var uri = "mongodb://rorys:mongolab2@ds037601.mongolab.com:37601/blogpostapp";
var mongooseConnectString = mongodbUri.formatMongoose(uri);
mongoose.connect(mongooseConnectString);

// Get notification for connection success or failure \\
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("connection made");
});

// Define database schema which determines which properties we want to store \\
var blogSchema = mongoose.Schema({
    author : String,
    title  : String,
    text   : String,
    date   : Object,
});

// Adding method to the schema. Have to be defined before schema is compiled \\
blogSchema.methods.announce = function() {
    var author = this.author ? "Blog post submitted by " + this.author : "Blog post submitted";
    console.log(author);
};

// Compile schema into a model, which defines the database collection \\
// First argument is collection name, second argument is schema name  \\
var blogPost = mongoose.model("blogpost", blogSchema);

// Example blog post \\
var testPost = new blogPost({ author : "bob smith",
                               title : "my first submission",
                                text : "this is some informatioon about an interesting topic of my choice",
                                date : "new date object"
                            });

// Saves submitted blog post to database and displays a message confirming \\
testPost.save(function(err, testPost){
    if (err) return console.error(err);
    testPost.announce();
});

// Create http server to serve saved blogposts \\
http.createServer(function (request, response) {
    if (request.url === "/") {
        // blogPost.find(function(err, blogPost) {
        //     response.write(JSON.stringify(blogPost));
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end("Thanks for visiting, test blog uploaded to database");
        };
    // } else if (request.url === "/form") {
    //     fs.readFile('index.html', function(err, page) {
    //     response.writeHead(200, {'Content-Type': 'text/html'});
    //     response.write(page);
    //     response.end();
    //     })
    // }
}).listen(4000);

console.log("Server running at 4000");

