var shot = require("shot");
var server = require("../lib/handler");
var assert = require("assert");
var request;

describe("The home page", function() {

    it("should respond with an OK status code", function(done) {

        request = {
            method: "GET",
            url: "/"
        };

        shot.inject(server, request, function(res) {
            assert.equal(res.statusCode, 200);
            done();
        });

    });

});

describe("The posts page", function() {

    it("should respond with an OK status code,", function(done) {

        request = {
            method: "GET",
            url: "/posts"
        };

        shot.inject(server, request, function(res) {
            assert.equal(res.statusCode, 200);
            done();
        });

    });
});

describe("A nonexistant page", function() {

    it("should respond with a 404 status code,", function(done) {

        request = {
            method: "GET",
            url: "/postalhost"
        };

        shot.inject(server, request, function(res) {
            assert.equal(res.statusCode, 404);
            done();
        });

    });
});
