"use strict";
var TsFieldGen = require("../../../generators/typescript/TsFieldGen");
QUnit.module("TsFieldGen", {});
QUnit.test("createFieldsSrcCode", function createFieldsSrcCodeTest(sr) {
    var fields = {
        "a": { type: "int" },
        "b": { type: "bool?[]" },
        "c": { type: "double[]", required: false },
        "d": { type: "IList<String>", required: true },
        "e": { type: { typeName: "IList", genericParameters: [{ typeName: "String" }] }, required: false },
    };
    var props = Object.keys(fields).map(function (name) { return TsFieldGen.typeTemplateToField(name, fields[name], true); });
    var res = TsFieldGen.createFieldsSrcCode(props, null, {});
    sr.deepEqual(res, ["public a: number;", "public b: boolean?[];", "public c?: number[];", "public d: IList<String>;", "public e?: IList<string>;"]);
});
