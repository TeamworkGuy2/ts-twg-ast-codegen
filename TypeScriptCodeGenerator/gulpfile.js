var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watchify = require('watchify');
var es6ify = require('es6ify');
var reactify = require('reactify');
var vinylSourceSource = require('vinyl-source-stream');
var execObj = require('child_process');
var exorcist = require('exorcist');
var exec = execObj.exec;
/** File paths */
var dstDir = "bin/";
var requireFiles = "./tsMeta/app.js";
var watchifyOptions = {
    entries: ["./tsMeta/app.js"],
    extensions: [".js", ".jsx"],
    paths: ["node_modules", "./tsMeta/stringManipulation", "./tsMeta/templates", "./tsMeta/templates/generators"]
};
function noop() {
}
function compileScripts(debug) {
    var dstFileName = "code-generator.js";
    var srcMapFile = dstDir + dstFileName + ".map";
    es6ify.traceurOverrides = { experimental: true };
    var bundler = watchify(watchifyOptions);
    bundler.require(requireFiles);
    bundler.transform(reactify);
    bundler.transform(es6ify.configure(/.jsx|tsMeta\\(?!.*\.ts)|tsMeta\/(?!.*\.ts)/));
    var pathChecks = [
        "tsMeta/",
        "tsMeta/stringManipulation",
        "tsMeta/templates",
        "tsMeta/templates/generators"
    ];
    var rebundle = function () {
        var startTime;
        var endTime;
        var stream = bundler.bundle({
            debug: debug,
            filter: function (path) {
                // tries to valid import statements for incorrect casing ('psUtils' vs. 'psutils') or absolute directories (not starting with './' or '../')
                var notPath = pathChecks.reduce(function (prev, cur) {
                    return prev && path.indexOf(cur) === -1;
                }, true);
                var notPathLowerCase = pathChecks.reduce(function (prev, cur) {
                    return prev && path.toLowerCase().indexOf(cur.toLowerCase()) === -1;
                }, true);
                if ((!notPath && !(path.indexOf("./") === 0 || path.indexOf("../") === 0)) || (notPath && !notPathLowerCase)) {
                    gutil.log("incorrect import: '" + path + "', ensure name case is correct and path begins with relative './' or '../'");
                }
                return true;
            }
        });
        var startCb = function () {
            startTime = Date.now();
            gutil.log("start building '" + dstFileName + "'...");
        };
        var doneCb = function () {
            endTime = Date.now();
            gutil.log("finished building '" + dstFileName + "', " + (endTime - startTime) + " ms");
        };
        var errorCb = function (err) {
            console.error("error building '" + dstFileName + "'", err);
        };
        stream.on("error", errorCb);
        stream.on("finish", doneCb);
        stream.on("end", doneCb);
        // exorcist filters off the source maps into a separate file
        stream = stream.pipe(exorcist(srcMapFile));
        stream = stream.pipe(vinylSourceSource(watchifyOptions.entries[0]));
        stream.pipe(rename(dstFileName));
        stream.pipe(gulp.dest(dstDir));
        startCb();
    };
    bundler.on("update", rebundle);
    return rebundle();
}
// ==== Base tasks ====
// "--file ../..." path of file to check
gulp.task("checkFileEncoding", function () {
    var fileArg = (gutil.env["file"] || "").toString();
    var srcFile = fileArg.trim();
    fs.readFile(srcFile, function (err, f) {
        if (err) {
            gutil.log("error reading file '" + srcFile + "': " + err + ", continuing");
        }
        gutil.log("checking '" + srcFile + "' file encoding");
        var lines = f.toString().split("\n");
        for (var i = 0, size = lines.length; i < size; i++) {
            var ln = lines[i];
            for (var k = 0, charCount = ln.length; k < charCount; k++) {
                if (ln.charCodeAt(k) > 127) {
                    gutil.log("(" + (i + 1) + "," + (k + 1) + ") '" + ln.charAt(k) + "': " + ln);
                }
            }
        }
    });
});
// "--debug true/false" (default true) whether to include extra debug info in compiled files like source maps
gulp.task("default", function () {
    var debugArg = (gutil.env["debug"] || "").toString();
    var debug = debugArg.trim().toLowerCase() !== "false";
    compileScripts(debug);
});
