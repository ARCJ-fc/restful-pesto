var shot    = require("shot");
var server  = require("../lib/handler");
var assert  = require("assert");
var fs      = require("fs");

var request;

describe("The home page", function() {
    it("should respond with an OK status code", function(done) {

        request = {
            method: "GET",
            url: "/"
        };
        
        shot.inject(server.home, request, function(res) {
            assert.equal(res.statusCode, 200);
            assert.equal(res.headers["Content-Type"], "text/html")
            done();
        });
    });
});

describe("The create post page", function() {
    it("should respond with an OK status code", function(done) {

        request = {
            method: "GET",
            url: "/createpost"
        };

        shot.inject(server.createPost, request, function(res) {
            assert.equal(res.statusCode, 200);
            assert.equal(res.headers["Content-Type"], "text/html")
            done();
        });
    })
})

describe("The css page", function() {
    it("should respond with an OK status code", function(done) {

        request = {
            method: "GET",
            url: "/index.css"
        };

        shot.inject(server.css, request, function(res) {
            assert.equal(res.statusCode, 200);
            assert.equal(res.headers["Content-Type"], "text/css");
            done();
        });
    });
});

describe("A nonexistant page", function() {
    it("should respond with a 404 status code", function(done) {

        request = {
            method: "GET",
            url: "/postalhost"
        };

        shot.inject(server.invalid, request, function(res) {
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});
