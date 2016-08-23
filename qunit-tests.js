/// <reference path="../definitions/custom/node-modules-custom.d.ts" />
/// <reference path="../definitions/custom/watchify/watchify.d.ts" />
/// <reference path="../definitions/exorcist/exorcist.d.ts" />
/// <reference path="../definitions/gulp/gulp.d.ts" />
/// <reference path="../definitions/gulp-rename/gulp-rename.d.ts" />
/// <reference path="../definitions/gulp-util/gulp-util.d.ts" />
/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/qunit/qunit.d.ts" />
/// <reference path="../definitions/vinyl-source-stream/vinyl-source-stream.d.ts" />
//var gutil = require("gulp-util");
var testRunner = require("qunit");
function callback() {
    //gutil.log("done a test: " + JSON.stringify(arguments));
}
testRunner.setup({
    log: {
        errors: true,
        tests: true,
        summary: true,
        globalSummary: true,
        coverage: true,
        globalCoverage: true,
        testing: true
    }
});
testRunner.run({
    code: "./strings/StringArray",
    tests: "./test/strings/StringArrayTest.js"
}, callback);
testRunner.run({
    code: "./strings/StringCase",
    tests: "./test/strings/StringCaseTest.js"
}, callback);
testRunner.run({
    code: "./generators/SimpleTemplateCompiler",
    tests: "./test/generators/SimpleTemplateCompilerTest.js"
}, callback);
testRunner.run({
    code: "./generators/typescript/TsFieldGen",
    tests: "./test/generators/typescript/TsFieldGenTest.js"
}, callback);
testRunner.run({
    code: "./generators/DefaultGenTools",
    tests: "./test/generators/GenToolsTest.js"
}, callback);
