var mongoose = require("mongoose");
var credentials = require("./credentials.js")

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


exports.writeToDB = function writeToDB(post, month) {

    blogSchema.set("collection", month);

    var blogPost = mongoose.model(month, blogSchema);
    var newBlogPost = new blogPost(post);

    newPost.save(function(err, newBlogPost){
        if (err) return console.error(err);
        newBlogPost.createPost();
        callback(res);
    });
}


exports.readFromDB = function readFromDB(month, res, data, callback) {

    blogSchema.set("collection", month);
    var blogPost = mongoose.model(month, blogSchema);

    blogPost.find(function(err, postsArray) {
        if (err) return console.error("error:", err);

        data.months[data.now] = postsArray;
        callback(res);
    });

}