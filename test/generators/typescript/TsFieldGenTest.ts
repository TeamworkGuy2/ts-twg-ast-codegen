"use strict";
import chai = require("chai");
import TsFieldGen = require("../../../generators/typescript/TsFieldGen");
import TypeConverter = require("../../../code-types/TypeConverter");

var asr = chai.assert;

suite("TsFieldGen", function TsFieldGenTest() {

    test("createFieldsSrcCode", function createFieldsSrcCodeTest() {
        var fields: StringMap<TypeTemplate> = {
            "a": { type: "int" },
            "b": { type: "bool?[]" },
            "c": { type: "double[]", required: false },
            "d": { type: "IList<String>", required: true }, // note: since this is generic, 'String' is not converted to TypeScript 'string'
            "e": { type: { typeName: "IList", genericParameters: [{ typeName: "String" }] }, required: false },
        };
        var props = Object.keys(fields).map((name) => TsFieldGen.typeTemplateToField(name, fields[name], true));

        var res = TsFieldGen.createFieldsSrcCode(props, null, {});
        asr.deepEqual(res, ["public a: number;", "public b: (boolean | null)[];", "public c?: number[];", "public d: IList<String>;", "public e?: IList<string>;"]);
    });

});
