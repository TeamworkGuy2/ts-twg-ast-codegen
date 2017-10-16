"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var TsFieldGen = require("../../../generators/typescript/TsFieldGen");
var asr = chai.assert;
suite("TsFieldGen", function TsFieldGenTest() {
    test("createFieldsSrcCode", function createFieldsSrcCodeTest() {
        var fields = {
            "a": { type: "int" },
            "b": { type: "bool?[]" },
            "c": { type: "double[]", required: false },
            "d": { type: "IList<String>", required: true },
            "e": { type: { typeName: "IList", genericParameters: [{ typeName: "String" }] }, required: false },
        };
        var props = Object.keys(fields).map(function (name) { return TsFieldGen.typeTemplateToField(name, fields[name], true); });
        var res = TsFieldGen.createFieldsSrcCode(props, null, {});
        asr.deepEqual(res, ["public a: number;", "public b: (boolean | null)[];", "public c?: number[];", "public d: IList<String>;", "public e?: IList<string>;"]);
    });
});
