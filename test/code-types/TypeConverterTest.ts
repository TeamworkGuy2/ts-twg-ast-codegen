"use strict";
import chai = require("chai");
import TypeConverter = require("../../code-types/TypeConverter");

var asr = chai.assert;

suite("TypeConverter", function TypeConverterTest() {

    function typeAst(name: string, arrayDimensions?: number, nullable?: boolean): CodeAst.Type {
        return {
            typeName: name,
            arrayDimensions: arrayDimensions || 0,
            nullable: nullable || false
        };
    }


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

    test("parseTypeTemplate", function parseTypeTemplateTest() {
        var typeTmpls = [
            "int",
            "float?",
            "bool[]",
            "double?[]",
        ];
        var res = typeTmpls.map((tt) => TypeConverter.parseTypeTemplate(tt));
        asr.deepEqual(res, [
            typeAst("int"),
            typeAst("float", 0, true),
            typeAst("bool", 1),
            typeAst("double", 1, true),
        ]);
    });


    suite("TypeScript", function TypeConverterTypeScriptTest() {

        test("createTypeTemplateToStringCode", function createTypeTemplateToStringCodeTest() {
            var types = [
                { typeName: "boolean" },
                { typeName: "number" },
                { typeName: "byte" },
                { typeName: "uint" },
                { typeName: "date" }
            ];
            var res = types.map((t) => TypeConverter.TypeScript.createTypeTemplateToStringCode(t, "myVal"));
            asr.deepEqual(res, [
                "(myVal ? \"true\" : \"false\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")"
            ]);
        });
    });

});
