"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var StringArray = require("../../strings/StringArray");
var asr = chai.assert;
suite("StringArray", function StringArrayTest() {
    test("new StringArray", function StringArrayInstTest() {
        var inst = new StringArray();
        var res = StringArray.of("a")
            .addAll(["", "b", 123])
            .prefixAll("-")
            .addPrefixNonEmpty(["{", "", "}"], '\t')
            .join('\n');
        asr.equal(res, "-a\n" +
            "-\n" +
            "-b\n" +
            "-123\n" +
            "\t{\n" +
            "\n" +
            "\t}");
    });
});
