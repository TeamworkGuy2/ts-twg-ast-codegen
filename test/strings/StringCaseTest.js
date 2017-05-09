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
    test("toCamelCase", function toCamelCase() {
        orig.forEach(function (str, i) {
            asr.equal(StringCase.toCamelCase(str), camelCase[i]);
        });
    });
    test("toTitleCase", function toTitleCase() {
        orig.forEach(function (str, i) {
            asr.equal(StringCase.toTitleCase(str), titleCase[i]);
        });
    });
    test("toUnderscoreCase", function toUnderscoreCase() {
        orig.forEach(function (str, i) {
            asr.equal(StringCase.toUnderscoreCase(str), underscoreCase[i]);
        });
    });
});
