var mongoose = require("mongoose");
var credentials = require("./credentials.js");

var blogSchema = mongoose.Schema({
    title   : String,
    content : String,
    author  : String,
    date    : String
});

blogSchema.methods.createPost = function() {
    console.log("blog post submitted by " + this.author);
}


exports.connectToDB = function connectToDB(){
    mongoose.connect(credentials.mongooseConnectString);

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error!"));
    db.once("open", function(){
        console.log("connection made")
    });
}


exports.getMonthString = function getMonthString(date) {

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()] || false;
}


exports.writeToDB = function writeToDB(month, res, data, callback) {

    blogSchema.set("collection", month);
    var blogPost = mongoose.model(month, blogSchema);

    var newBlogPost = new blogPost(data);

    newBlogPost.save(function(err, newBlogPost){
        if (err) return console.error(err);
        return callback;
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
