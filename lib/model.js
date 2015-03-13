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
    record      : Object
});

authSchema.set("collection", "Users");
tokenSchema.set("collection", "Tokens");



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

exports.checkUserInDB = function checkUserInDB(post, req, res, callback1, callback2) {

    var user = mongoose.model("Users", authSchema);

    user.find({username: post.username}, function(err, usersArray) {
        if (err) {console.error("error:", err); return false;}
        if(usersArray[0] && usersArray[0].password === post.password) {
            return callback1(req, res);
        } else {
            return callback2;
        }
    });
}

exports.checkTokenInDB = function checkTokenInDB(decoded_auth, callback) {

    var tokenModel = mongoose.model("Tokens", tokenSchema);

    tokenModel.find({GUID: decoded_auth}, callback);
}

exports.writeTokenToDB = function writeTokenToDB(GUID, record, callback) {

    var tokenModel = mongoose.model("Tokens", tokenSchema);

    var newToken = new tokenModel({
        GUID    : GUID,
        record  : record
    });

    newToken.save(function (err, savedToken){
        if (err) {return console.error(err);};
        console.log('Token saved: ', savedToken);
        return callback();
    });
}