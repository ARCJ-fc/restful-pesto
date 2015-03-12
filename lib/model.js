var mongoose = require("mongoose");
var credentials = require("./credentials.js");

var blogSchema = mongoose.Schema({
    title   : String,
    content : String,
    author  : String,
    date    : String
});

exports.connectToDB = function connectToDB(){
    mongoose.connect(credentials.mongooseConnectString);

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error!"));
    db.once("open", function(){
        console.log("connection made")
    });
}

exports.writeToDB = function writeToDB(month, res, data, callback) {

    blogSchema.set("collection", month);
    var blogPost = mongoose.model(month, blogSchema);

    var newBlogPost = new blogPost(data);

    newBlogPost.save(function(err, newBlogPost){
        if (err) return console.error(err);
        return callback(res);
    });
}


exports.readFromDB = function readFromDB(month, res, data, callback) {

    blogSchema.set("collection", month);
    var blogPost = mongoose.model(month, blogSchema);

    blogPost.find(function(err, postsArray) {
        if (err) return console.error("error:", err);

        data.months[data.now] = postsArray;
        return callback(res) || false;
    });
}
