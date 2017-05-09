"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var SimpleTemplateCompiler = require("../../generators/SimpleTemplateCompiler");
var asr = chai.assert;
suite("SimpleTemplateCompiler", function SimpleTemplateCompilerTest() {
    test("new SimpleTemplateCompiler", function SimpleTemplateCompilerInstTest() {
        var t = new SimpleTemplateCompiler("$", "$", {
            "userName": "$id$",
            "$userStatus$": "$status$"
        }, {
            "$displayText$": "$helloMsg$, $id$ - $userStatus$",
            "$helloMsg$": "Welcome",
            "$userStatus$": "$status$"
        });
        var res1 = t.render("1. $displayText$", { userName: "Bill Mill", "$userStatus$": "Stand back, I'm doing code!" });
        var res2 = t.render("2. $displayText$", { userName: "Jill Will", "$userStatus$": null });
        asr.equal(res1, "1. Welcome, Bill Mill - Stand back, I'm doing code!");
        asr.equal(res2, "2. Welcome, Jill Will - null");
    });
});
