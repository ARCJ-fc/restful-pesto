var model       = require("./model.js")
var fs          = require("fs");
var jade        = require("jade");
var path        = require("path");
var querystring = require("querystring");
var jwt         = require("jsonwebtoken");

var secret  = "change_this_to_something_randomized"; //secret should be the key to a cryption method
var root    = path.resolve(__dirname + "/../"); //absoloute path (root is thus restful pesto, without /../ lib would become root which is wrong)

var extensions      = {};
extensions[".css"]  = ["css", "text/css"];
extensions[".js"]   = ["js", "text/javascript"];
extensions[".png"]  = ["assets", "image/png"];


var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var data = {
    now     : new Date(),
    months  : {
        January     : [],
        February    : [],
        March       : [],
        April       : [],
        May         : [],
        June        : [],
        July        : [],
        August      : [],
        September   : [],
        October     : [],
        November    : [],
        December    : []
    }
};


exports.home = function home(req, res) {

    var now = new Date();
    data.now = months[now.getMonth()];

    var fileName = root + "/lib/views/index.jade";

    model.readFromDB(data.now, res, data, function() {
        var fn = jade.compileFile(fileName, {fileName: "index.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fn(data));
    });
}

exports.loginPage = function loginPage(req, res) {
    var fileName = root + "/lib/views/loginpage.jade";
    var fn = jade.compileFile(fileName, {fileName: "loginpage.jade"});

    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(fn(data));
}

exports.loginSuccess = function loginSuccess(req, res) {
    var fileName = root + "/lib/views/loginsuccess.jade";
    var fn = jade.compileFile(fileName, {fileName: "loginsuccess.jade"});

    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(fn(data));
}


exports.createPost = function createPost(req, res) {

    validate(req, res, function(token){
        var fileName = root + "/lib/views/createpost.jade"
        var fn = jade.compileFile(fileName, {fileName: "createpost.jade"});

        res.writeHead(200, {"Content-Type": "text/html", "authorization": token});
        res.end(fn(data));
    });
}


exports.submitNewBlogPost = function submitNewBlogPost(req, res) {

    var queryData = "";

    req.on("data", function(data) {
        queryData += data;
    }).on("end", function() {
        req.post = querystring.parse(queryData);

        var d         = new Date()
        req.post.date = d.toDateString().split(" ").slice(0, 3).join(" ");
        var thisMonth = months[d.getMonth()];
        req.post.tags = [thisMonth, req.post.tags];

        model.writeToDB(thisMonth, res, req.post, function(res) {
            res.writeHead(201, {"Content-Type": "text/plain"});
            res.end("/");
        });
    })
}


exports.utils = function utils(req, res) {

    var ext = path.extname(req.url);

    if (!extensions[ext]) {
        console.log("File not found!");
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>File not found m8</h1>");
        return false;
    }

    var fileName = root + "/lib/views/" + extensions[ext][0] + req.url;

    fs.readFile(fileName, function(err, contents) {
        if (err) {res.writeHead(404); res.end("nope");}
        res.writeHead(200, {"Content-Type": extensions[ext][1]});
        res.end(contents);
    });
}


exports.invalid = function invalid(req, res) {

    var now = new Date();
    data.now = months[now.getMonth()];

    var fileName = root + "/lib/views/404page.jade";

    model.readFromDB(data.now, res, data, function() {
        var fn = jade.compileFile(fileName, {fileName: "404page.jade"});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fn(data));
    });
}


// *********************
// *** Authorisation functions

// Handling logins
exports.logMeIn = function logMeIn(req, res) {
    if (req.method === "POST") {
        var queryData = "";

        req.on("data", function(data) {
            queryData += data;
        }).on("end", function(){
            var post = querystring.parse(queryData);

            function loginFailed() {
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end("/loginpage");
            }

            model.checkUserInDB(post, req, res, authSuccess, loginFailed);
        });
    } else {
        return exports.loginPage(req, res);
    }
}


// Token generation functions
function generateGUID() {
    return new Date().getTime();
}

function generateToken(req, GUID) {
    var token = jwt.sign({
        auth    : GUID,
        agent   : req.headers["user-agent"],
        exp     : new Date().getTime() + 1000*60*60
    }, secret); 
    return token;
}

// Token generation upon successful login
function authSuccess(req, res) {
    var GUID    = generateGUID();
    var token   = generateToken(req, GUID);
    var record  = {
        valid   : "true",
        created : new Date().getTime()
    }
    console.log("Successful login!");

    model.writeTokenToDB(GUID, record, function() {
        res.writeHead(200, {
            "Content-Type"  : "text/plain",
            "authorization" : token,
            "Set-Cookie"    : token
        });
        res.end("/loginsuccess");
    });
}

// Token validation upon attempting to access restricted pages
function verify(token) {

    var decoded = false;

    try { decoded = jwt.verify(token, secret); }
    catch (e) { decoded = false };
    return decoded;
}

function validate(req, res, callback) {

    var token = req.headers.authorization || req.headers.cookie;
    var decoded = verify(token);

    if (!decoded || !decoded.auth){
        exports.loginPage(req,res);
    } else {
        model.checkTokenInDB(decoded.auth, function(err, dbToken) {
            var record = dbToken[0].record;
            if (err || !record.valid) {
                exports.loginPage(req, res);
            } else {
                callback(token);
            };
        });
    };
}
