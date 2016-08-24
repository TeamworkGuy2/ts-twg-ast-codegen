/// <reference path="../definitions/custom/node-modules-custom.d.ts" />
/// <reference path="../definitions/custom/watchify/watchify.d.ts" />
/// <reference path="../definitions/exorcist/exorcist.d.ts" />
/// <reference path="../definitions/gulp/gulp.d.ts" />
/// <reference path="../definitions/gulp-rename/gulp-rename.d.ts" />
/// <reference path="../definitions/gulp-util/gulp-util.d.ts" />
/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/qunit/qunit.d.ts" />
/// <reference path="../definitions/vinyl-source-stream/vinyl-source-stream.d.ts" />
import fs = require("fs");
import vm = require("vm");
import gulp = require("gulp");
import gutil = require("gulp-util");
import rename = require("gulp-rename");
import watchify = require("watchify");
import es6ify = require("es6ify");
import vinylSourceSource = require("vinyl-source-stream");
import Q = require("q");
import child_process = require("child_process");
import exorcist = require("exorcist");
// testing...
import UiRunner = require("./ui-assistant/UiRunner");
/*
"babelify": "~7.2.0",
"babel-preset-es2015": "~6.6.0",
"babel-preset-react": "~6.5.0",
"browserify": "~13.0.0",
*/

var exec = child_process.exec;

/** File paths */
var dstDir = "bin/";
var rootFile = "./ts-meta/App.js";
//var requireFiles = "./ts-meta/App.js";
var watchifyOptions = {
    entries: [rootFile],
    extensions: [".js", ".jsx"],
    paths: ["node_modules", "./code-types", "./file-io", "./generators", "./parsers", "./strings", "./ts-meta"]
};


function noop() { }


function compileScripts(debug: boolean) {
    var dstFileName = "code-generator.js";
    var srcMapFile = dstDir + dstFileName + ".map";
    es6ify.traceurOverrides = { experimental: true };
    var bundler = watchify(<any>watchifyOptions);
    //bundler.require(requireFiles);
    //bundler.transform(reactify);
    bundler.transform(es6ify.configure(/.jsx|ts-meta\\(?!.*\.ts)|ts-meta\/(?!.*\.ts)/));

    var pathChecks = [
        "code-types",
        "file-io",
        "generators",
        "parsers",
        "strings",
        "ts-meta"
    ];

    function rebundle() {
        var startTime;
        var endTime;
        var stream = bundler.bundle({
            debug: debug,
            filter: function (path) {
                // tries to valid import statements for incorrect casing ('psUtils' vs. 'psutils') or absolute directories (not starting with './' or '../')
                var notPath = pathChecks.reduce(function (prev, cur) { return prev && path.indexOf(cur) === -1; }, true);
                var notPathLowerCase = pathChecks.reduce(function (prev, cur) { return prev && path.toLowerCase().indexOf(cur.toLowerCase()) === -1; }, true);
                if ((!notPath && !(path.indexOf("./") === 0 || path.indexOf("../") === 0)) || (notPath && !notPathLowerCase)) {
                    gutil.log("incorrect import: '" + path + "', ensure name case is correct and path begins with relative './' or '../'");
                }
                return true;
            }
        });

        function startCb() {
            startTime = Date.now();
            gutil.log("start building '" + dstFileName + "'...");
        }

        function doneCb() {
            endTime = Date.now();
            gutil.log("finished building '" + dstFileName + "', " + (endTime - startTime) + " ms");
        }

        function errorCb(err) {
            console.error("error building '" + dstFileName + "'", err);
        }

        stream.on("error", errorCb);
        stream.on("finish", doneCb);
        stream.on("end", doneCb);

        // exorcist filters off the source maps into a separate file
        stream = stream.pipe(exorcist(srcMapFile));

        stream = stream.pipe(vinylSourceSource(rootFile));
        stream.pipe(rename(dstFileName));
        stream.pipe(gulp.dest(dstDir));

        startCb();
    }

    bundler.on("update", rebundle);
    return rebundle();
}


// ==== Base tasks ====

// "--file ../..." path of file to check
gulp.task("checkFileEncoding", function () {
    var fileArg = (<string>gutil.env["file"] || "").toString();
    var srcFile = fileArg.trim();

    var src = fs.readFileSync(srcFile);

    gutil.log("checking '" + srcFile + "' file encoding");

    var lines = src.toString().split("\n");
    for (var i = 0, size = lines.length; i < size; i++) {
        var ln = lines[i];
        for (var k = 0, charCount = ln.length; k < charCount; k++) {
            if (ln.charCodeAt(k) > 127) {
                gutil.log("(" + (i + 1) + "," + (k + 1) + ") '" + ln.charAt(k) + "': " + ln);
            }
        }
    }
});


gulp.task("runTests", function () {
    //Tests.runAll(gutil.log);
});


gulp.task("testReadFileSections", function () {
    UiRunner.main(null, gutil);
});


// "--debug true/false" (default true) whether to include extra debug info in compiled files like source maps
gulp.task("default", function () {
    var debugArg = (<string>gutil.env["debug"] || "").toString();
    var debug = debugArg.trim().toLowerCase() !== "false";

    compileScripts(debug);
});
