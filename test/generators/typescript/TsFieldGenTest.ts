"use strict";
import TsFieldGen = require("../../../generators/typescript/TsFieldGen");

QUnit.module("TsFieldGen", {
});

QUnit.test("createFieldsSrcCode", function createFieldsSrcCodeTest(sr) {
    var fields: StringMap<DtoPropertyTemplate> = {
        "a": { type: "int", primaryKey: true },
        "b": { type: "bool[]?" },
        "c": { type: "double[]", required: false },
        "d": { type: "IList<string>", required: true }
    };
    var props = Object.keys(fields).map((name) => TsFieldGen.typInfoToField(name, fields[name]));

    var res = TsFieldGen.createFieldsSrcCode(props, null, {});
    sr.deepEqual(res, ["public a: number;", "public b?: boolean[];", "public c?: number[];", "public d: IList<string>;"]);
});