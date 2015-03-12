var model = require('./model.js');
var jade = require("jade");
var path = __dirname + "/views";
var url = require("url");
var jwt  = require('jsonwebtoken');
var secret = "CHANGE_THIS_TO_SOMETHING_RANDOM"; // super secret
var querystring = require('querystring');


function authFail(req,res){
	res.writeHead(401, {'Content-Type': 'text/html'});
	var fn = jade.compileFile(path + "/fail.jade");
	res.end(fn(test_data));
}


// Question: Why are we doing this?
function generateGUID() {
  return new Date().getTime();
}


function generateToken(req, GUID){
	var token = jwt.sign({
		auth: GUID,
		agent: req.headers['user-agent'], // Question: What it this?
		exp: new Date().getTime() + 7*24*60*60*1000 // Question: so this token expires sometime?
	}, secret);
	return token;
}


function authSuccess(req,res){
	var GUID = generateGUID(); // Question: What is this?
	var token = generateToken(req,GUID);
	var record = {
		valid: "true",
		created: new Date().getTime()
	};

	model.writeTokenToDB(GUID, record, function(res) {

		var fn = jade.compileFile(path + "/restricted.jade");

		res.writeHead(200, {
			'Content-Type': 'text/html',
			'authorization': token,
			'Set-Cookie': token
		});
		res.end(fn(test_data));
	});
}

function writeTokenToDB(GUID, record, callback) {

	new_token = new model.Token({
		GUID: GUID,
		record: record
	});

	new_token.save(function (err, saved_token){
	    if (err) return console.error(err);
	    console.log('saved token: ', saved_token);
	});

	callback;
}


 function authHandler(req,res){
		if (req.method === 'POST'){
			var body = '';
			req.on('data', function(data){
				body += data;
			});
			req.on('end', function(){
				var post = querystring.parse(body);
				if (post.username && post.username === u.un && post.password && post.password == u.pw){
					return authSuccess(req,res);
				} else {
					return authFail(req,res);
				}
			});
		} else {
			return authFail(req, res);
		}
	}
}

// ******************
function verify(token){
	var decoded = false;
	try{
		decoded = jwt.verify(token, secret);
	} catch (e) {
		decoded = false;
	}
	return decoded;
}

function checkTokenInDB(decoded.auth, callback) {
	model.Token.find({ GUID: decoded.auth}, callback);
}

function validate(req, res, callback){
	var token = req.headers.authorization || req.headers.cookie;
	var decoded = verify(token);

	if ( !decoded || !decoded.auth ){
		authFail(req,res);
	} else {
		model.checkTokenInDB(decoded.auth, function(err, db_token) {
			record = db_token[0].record;
			if ( err || !record.valid ){
				authFail(req,res)
			} else {
				privado(res,token);
			};
		});
	});
}


function privado(res,token){
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'authorization': token
});

	var fn = jade.compileFile(path + "/restricted.jade");
  	var htmlOutput = fn(test_data);
  	return res.end(htmlOutput);
}
// ------------------

