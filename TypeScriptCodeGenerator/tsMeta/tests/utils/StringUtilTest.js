"use strict";
var TestUtil = require("../TestUtil");
var StringUtil = require("../../utils/StringUtil");
var StringUtilTest;
(function (StringUtilTest) {
    function testRemoveLeading(log) {
        var inputs = [
            ["arg, arg, arg", "arg, ", false],
            ["bla, bla, bla", "bla, ", true],
            ["{{warg}}", "{", true],
        ];
        var expect = [
            "arg, arg",
            "bla",
            "warg}}",
        ];
        log("starting func 'testRemoveLeading'");
        TestUtil.runTests(null, inputs, expect, StringUtil.removeLeading);
    }
    StringUtilTest.testRemoveLeading = testRemoveLeading;
    function testRemoveTrailing(log) {
        var inputs = [
            ["arg, arg, arg", ", arg", false],
            ["bla, bla, bla", ", bla", true],
            ["{{warg}}", "}", true],
        ];
        var expect = [
            "arg, arg",
            "bla",
            "{{warg",
        ];
        log("starting func 'testRemoveTrailing'");
        TestUtil.runTests(null, inputs, expect, StringUtil.removeTrailing);
    }
    StringUtilTest.testRemoveTrailing = testRemoveTrailing;
})(StringUtilTest || (StringUtilTest = {}));
module.exports = StringUtilTest;
