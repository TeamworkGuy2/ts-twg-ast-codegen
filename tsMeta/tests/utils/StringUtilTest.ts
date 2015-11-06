"use strict";
import TestUtil = require("../TestUtil");
import StringUtil = require("../../utils/StringUtil");

module StringUtilTest {

    export function testRemoveLeading(log?: LogFunc) {
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


    export function testRemoveTrailing(log?: LogFunc) {
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

}

export = StringUtilTest;
