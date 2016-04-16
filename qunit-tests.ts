/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/node/node-modules-custom.d.ts" />
/// <reference path="../definitions/lib/qunit.d.ts" />
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
    code: "./generators/SimpleTemplateCompiler",
    tests: "./test/generators/SimpleTemplateCompilerTest.js"
}, callback);

testRunner.run({
    code: "./generators/typescript/TsFieldGen",
    tests: "./test/generators/typescript/TsFieldGenTest.js"
}, callback);