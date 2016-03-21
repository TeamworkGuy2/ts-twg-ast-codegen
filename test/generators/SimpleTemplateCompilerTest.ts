"use strict";
import SimpleTemplateCompiler = require("../../generators/SimpleTemplateCompiler");

QUnit.module("SimpleTemplateCompiler", {
});

QUnit.test("new SimpleTemplateCompiler", function SimpleTemplateCompilerInstTest(sr) {
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

    sr.equal(res1, "1. Welcome, Bill Mill - Stand back, I'm doing code!");
    sr.equal(res2, "2. Welcome, Jill Will - null");
});