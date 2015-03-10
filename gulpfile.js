var gulp 	= require("gulp");
var mocha 	= require("gulp-mocha");
var gutil 	= require("gulp-util");
var jshint 	= require("gulp-jshint");
var stylish	= require("jshint-stylish");

gulp.task("mocha", function() {
    return gulp.src(["test/*.js"], { read: false })
        .pipe(mocha({ reporter: "list" }))
        .on("error", gutil.log);
});

gulp.task("watch-mocha", function() {
    gulp.watch(["lib/**.js", "test/**.js"], ["mocha"]);
});

gulp.task("lint", function() {
  return gulp.src("./lib/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("YOUR_REPORTER_HERE"));
});

gulp.task("watch-lint", function() {
    gulp.watch(["lib/**.js", "test/**.js"], ["lint"]);
});

gulp.task("default", ["mocha","watch-mocha", "watch-lint"]);