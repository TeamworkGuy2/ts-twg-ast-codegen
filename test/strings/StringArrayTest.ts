"use strict";
import StringArray = require("../../strings/StringArray");

QUnit.module("StringArray", {
});

QUnit.test("new StringArray", function StringArrayInstTest(sr) {
    var inst = new StringArray();
    var res = StringArray.of("a")
        .addAll(["", "b", 123])
        .prefixAll("-")
        .addPrefixNonEmpty(["{", "", "}"], '\t')
        .join('\n');

    sr.equal(res,
        "-a\n" +
        "-\n" +
        "-b\n" +
        "-123\n" +
        "\t{\n" +
        "\n" +
        "\t}");
});