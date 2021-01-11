"use strict";
import chai = require("chai");
import StringCase = require("../../strings/StringCase");

var asr = chai.assert;

suite("StringCase", function StringCaseTest() {

    test("isCamelCase()", function isCamelCase() {
        camelCase.forEach((str) => asr.isTrue(StringCase.isCamelCase(str)));
        camelCaseNum.forEach((str) => asr.isTrue(StringCase.isCamelCase(str)));
    });

    test("isTitleCase()", function isTitleCase() {
        titleCase.forEach((str) => asr.isTrue(StringCase.isTitleCase(str)));
        titleCaseNum.forEach((str) => asr.isTrue(StringCase.isTitleCase(str)));
    });

    test("isUnderscoreCase()", function isUnderscoreCase() {
        underscoreCase.forEach((str) => asr.isTrue(StringCase.isUnderscoreCase(str)));
        underscoreCaseNum.forEach((str) => asr.isTrue(StringCase.isUnderscoreCase(str)));
    });

    var orig =           ["At_Bat_Cat", "ABC",   "atBatCat",   "at_sat_vat", "CharAt"];
    var camelCase =      ["atBatCat",   "aBC",   "atBatCat",   "atSatVat",   "charAt"];
    var titleCase =      ["AtBatCat",   "ABC",   "AtBatCat",   "AtSatVat",   "CharAt"];
    var underscoreCase = ["At_Bat_Cat", "A_B_C", "At_Bat_Cat", "at_sat_vat", "Char_At"];

    test("toCamelCase(basic)", function toCamelCase() {
        orig.forEach((str, i) => asr.equal(StringCase.toCamelCase(str), camelCase[i]));
    });

    test("toTitleCase(basic)", function toTitleCase() {
        orig.forEach((str, i) => asr.equal(StringCase.toTitleCase(str), titleCase[i]));
    });

    test("toUnderscoreCase(basic)", function toUnderscoreCase() {
        orig.forEach((str, i) => asr.equal(StringCase.toUnderscoreCase(str), underscoreCase[i]));
    });

    var origNum =           ["At1",  "At123",  "At1At",   "At123At",   "At_1", "At_123", "At_1_At", "at_1_at", "At_123_At", "at1",  "at123",  "at1at",  "at123at"];
    var camelCaseNum =      ["at1",  "at123",  "at1At",   "at123At",   "at1",  "at123",  "at1At",   "at1At",   "at123At",   "at1",  "at123",  "at1at",  "at123at"];
    var titleCaseNum =      ["At1",  "At123",  "At1At",   "At123At",   "At1",  "At123",  "At1At",   "At1At",   "At123At",   "At1",  "At123",  "At1at",  "At123at"];
    var underscoreCaseNum = ["At_1", "At_123", "At_1_At", "At_123_At", "At_1", "At_123", "At_1_At", "at_1_at", "At_123_At", "At_1", "At_123", "At_1at", "At_123at"];

    test("toCamelCase(numeric)", function toCamelCase() {
        origNum.forEach((str, i) => asr.equal(StringCase.toCamelCase(str), camelCaseNum[i]));
    });

    test("toTitleCase(numeric)", function toTitleCase() {
        origNum.forEach((str, i) => asr.equal(StringCase.toTitleCase(str), titleCaseNum[i]));
    });

    test("toUnderscoreCase(numeric)", function toUnderscoreCase() {
        origNum.forEach((str, i) => asr.equal(StringCase.toUnderscoreCase(str), underscoreCaseNum[i]));
    });

    test("toUnderscoreCase(capitalize)", function toUnderscoreCaseCapitalize() {
        asr.equal(StringCase.toSeparatedCase("-_-", "-", true), "-_-");
        asr.equal(StringCase.toSeparatedCase("TheTestCase", "-", false), "The-Test-Case");
        asr.equal(StringCase.toSeparatedCase("The-Test-Case", "-", false), "The-Test-Case");
        asr.equal(StringCase.toSeparatedCase("1-2-3", "-", true), "1-2-3");
        asr.equal(StringCase.toSeparatedCase("a-snake-case", "-", true), "A-Snake-Case");
        asr.equal(StringCase.toSeparatedCase("upper-Case-lower-Case", "-", true), "Upper-Case-Lower-Case");
    });

});
