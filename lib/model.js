var mongoose    = require("mongoose");
var credentials = require("./credentials.js");


var blogSchema  = mongoose.Schema({
    title       : String,
    content     : String,
    author      : String,
    date        : String,
    tags        : Array
});

var authSchema  = mongoose.Schema({
    username    : String,
    password    : String,
    email       : String
});

var tokenSchema = mongoose.Schema({
    GUID        : String,
    record      : String
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
        return callback(res);
    });
}

exports.checkUserInDB = function checkUserInDB() {

    authSchema.set("collection", "Users");
    var user = mongoose.model("Users", authSchema);

    authSchema.find(function(err, usersArray) {
        if (err) return console.error("error:", err);

        return usersArray;
    })
}

exports.checkTokenInDB = function checkTokenInDB(decoded_auth, callback) {
    tokenSchema.set("collection", "Tokens");
    var tokenModel = mongoose.model("Tokens", tokenSchema);
    Token.find({GUID: decoded_auth}, callback);
}
