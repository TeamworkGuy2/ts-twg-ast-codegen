"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var TypeConverter = require("../../../code-types/TypeConverter");
var asr = chai.assert;
suite("TypeConverter", function TypeConverterTest() {
    test("typeToString", function typeToStringTest() {
        var types = [
            { typeName: "int" },
            { typeName: "float", nullable: true },
            { typeName: "bool", arrayDimensions: 1 },
            { typeName: "double", arrayDimensions: 1, nullable: true },
            { typeName: "IList", genericParameters: [{ typeName: "String" }], nullable: false },
            { typeName: "IDictionary", genericParameters: [{ typeName: "String" }, { typeName: "decimal", arrayDimensions: 1 }], nullable: true },
        ];
        var res = types.map(function (t) { return TypeConverter.typeToString(t, function (tn) { return TypeConverter.TypeScript.convertSimpleType(tn, true); }, true, " | null"); });
        asr.deepEqual(res, [
            "number",
            "number | null",
            "boolean[]",
            "(number | null)[]",
            "IList<string>",
            "IDictionary<string, number[]> | null"
        ]);
    });
});
