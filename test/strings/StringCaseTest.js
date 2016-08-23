"use strict";
var StringCase = require("../../strings/StringCase");
QUnit.module("StringCase", {});
var orig = ["At_Bat_Cat", "ABC", "atBatCat", "CharAt"];
var camelCase = ["atBatCat", "aBC", "atBatCat", "charAt"];
var titleCase = ["AtBatCat", "ABC", "AtBatCat", "CharAt"];
var underscoreCase = ["At_Bat_Cat", "A_B_C", "At_Bat_Cat", "Char_At"];
QUnit.test("toCamelCase", function toCamelCase(sr) {
    orig.forEach(function (str, i) {
        sr.equal(StringCase.toCamelCase(str), camelCase[i]);
    });
});
QUnit.test("toTitleCase", function toTitleCase(sr) {
    orig.forEach(function (str, i) {
        sr.equal(StringCase.toTitleCase(str), titleCase[i]);
    });
});
QUnit.test("toUnderscoreCase", function toUnderscoreCase(sr) {
    orig.forEach(function (str, i) {
        sr.equal(StringCase.toUnderscoreCase(str), underscoreCase[i]);
    });
});
