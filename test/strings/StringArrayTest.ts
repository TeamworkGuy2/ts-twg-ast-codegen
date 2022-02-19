"use strict";
import chai = require("chai");
import StringArray = require("../../strings/StringArray");

var asr = chai.assert;

suite("StringArray", function () {

    test("new StringArray()", function () {
        var inst = new StringArray();
        var res = StringArray.of("a")
            .addAll(["", "b", 123])
            .prefixAll("-")
            .addPrefixNonEmpty(["{", "", "}"], '\t')
            .join('\n');

        asr.equal(res,
            "-a\n" +
            "-\n" +
            "-b\n" +
            "-123\n" +
            "\t{\n" +
            "\n" +
            "\t}");
    });


    test("flattenMapJoin", function () {
        var res = StringArray.flattenMapJoin({
            alpha: ["alpha"],
            count: ["1", "2", "3", "4", "5"],
            last: [""],
        }, ["-"]);

        asr.deepEqual(res, [
            "alpha", "-", "1", "2", "3", "4", "5", "-", ""
        ]);
    });


    test("", function () {
        var prefix = "+";
        var suffix = ":";
        var res = StringArray.preAppend(prefix, suffix, ["alpha", "beta", "end"]);

        asr.deepEqual(res, [
            "+alpha:", "+beta:", "+end:"
        ]);
    });

});
