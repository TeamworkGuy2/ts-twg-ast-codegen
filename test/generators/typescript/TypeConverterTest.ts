"use strict";
import chai = require("chai");
import TypeConverter = require("../../../code-types/TypeConverter");

var asr = chai.assert;

suite("TypeConverter", function TypeConverterTest() {

    test("typeToString", function typeToStringTest() {
        var types: CodeAst.Type[] = [
            { typeName: "int" },
            { typeName: "float", nullable: true },
            { typeName: "bool", arrayDimensions: 1 },
            { typeName: "double", arrayDimensions: 1, nullable: true },
            { typeName: "IList", genericParameters: [{ typeName: "String" }], nullable: false }, // note: since this is generic, 'String' is not converted to TypeScript 'string'
            { typeName: "IDictionary", genericParameters: [{ typeName: "String" }, { typeName: "decimal", arrayDimensions: 1 }], nullable: true },
        ];

        var res = types.map((t) => TypeConverter.typeToString(t, (tn) => TypeConverter.TypeScript.convertSimpleType(tn, true), true, " | null"));
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
