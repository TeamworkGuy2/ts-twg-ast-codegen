"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var StringCase = require("../../strings/StringCase");
var asr = chai.assert;
suite("StringCase", function StringCaseTest() {
    var orig = ["At_Bat_Cat", "ABC", "atBatCat", "CharAt"];
    var camelCase = ["atBatCat", "aBC", "atBatCat", "charAt"];
    var titleCase = ["AtBatCat", "ABC", "AtBatCat", "CharAt"];
    var underscoreCase = ["At_Bat_Cat", "A_B_C", "At_Bat_Cat", "Char_At"];
    test("toCamelCase(basic)", function toCamelCase() {
        orig.forEach(function (str, i) { return asr.equal(StringCase.toCamelCase(str), camelCase[i]); });
    });
    test("toTitleCase(basic)", function toTitleCase() {
        orig.forEach(function (str, i) { return asr.equal(StringCase.toTitleCase(str), titleCase[i]); });
    });
    test("toUnderscoreCase(basic)", function toUnderscoreCase() {
        orig.forEach(function (str, i) { return asr.equal(StringCase.toUnderscoreCase(str), underscoreCase[i]); });
    });
    var origNum = ["At1", "At123", "At1At", "At123At", "At_1", "At_123", "At_1_At", "At_123_At", "at1", "at123", "at1at", "at123at"];
    var camelCaseNum = ["at1", "at123", "at1At", "at123At", "at1", "at123", "at1At", "at123At", "at1", "at123", "at1at", "at123at"];
    var titleCaseNum = ["At1", "At123", "At1At", "At123At", "At1", "At123", "At1At", "At123At", "At1", "At123", "At1at", "At123at"];
    var underscoreCaseNum = ["At_1", "At_123", "At_1_At", "At_123_At", "At_1", "At_123", "At_1_At", "At_123_At", "At_1", "At_123", "At_1at", "At_123at"];
    test("toCamelCase(numeric)", function toCamelCase() {
        origNum.forEach(function (str, i) { return asr.equal(StringCase.toCamelCase(str), camelCaseNum[i]); });
    });
    test("toTitleCase(numeric)", function toTitleCase() {
        origNum.forEach(function (str, i) { return asr.equal(StringCase.toTitleCase(str), titleCaseNum[i]); });
    });
    test("toUnderscoreCase(numeric)", function toUnderscoreCase() {
        origNum.forEach(function (str, i) { return asr.equal(StringCase.toUnderscoreCase(str), underscoreCaseNum[i]); });
    });
});
