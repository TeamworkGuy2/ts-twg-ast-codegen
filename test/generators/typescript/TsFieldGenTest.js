"use strict";
var TsFieldGen = require("../../../generators/typescript/TsFieldGen");
QUnit.module("TsFieldGen", {});
QUnit.test("createFieldsSrcCode", function createFieldsSrcCodeTest(sr) {
    var fields = {
        "a": { type: "int", primaryKey: true },
        "b": { type: "bool[]?" },
        "c": { type: "double[]", required: false },
        "d": { type: "IList<string>", required: true }
    };
    var props = Object.keys(fields).map(function (name) { return TsFieldGen.typInfoToField(name, fields[name]); });
    var res = TsFieldGen.createFieldsSrcCode(props, null, {});
    sr.deepEqual(res, ["public a: number;", "public b?: boolean[];", "public c?: number[];", "public d: IList<string>;"]);
});
