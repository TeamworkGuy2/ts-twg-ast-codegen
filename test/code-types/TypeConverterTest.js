"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var TypeConverter = require("../../code-types/TypeConverter");
var asr = chai.assert;
suite("TypeConverter", function TypeConverterTest() {
    function typeAst(name, arrayDimensions, nullable) {
        return {
            typeName: name,
            arrayDimensions: arrayDimensions || 0,
            nullable: nullable || false
        };
    }
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
    test("parseTypeTemplate", function parseTypeTemplateTest() {
        var typeTmpls = [
            "int",
            "float?",
            "bool[]",
            "double?[]",
        ];
        var res = typeTmpls.map(function (tt) { return TypeConverter.parseTypeTemplate(tt); });
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
            var res = types.map(function (t) { return TypeConverter.TypeScript.createTypeTemplateToStringCode(t, "myVal"); });
            asr.deepEqual(res, [
                "(myVal ? \"true\" : \"false\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")",
                "(myVal ? myVal.toString() : \"null\")"
            ]);
        });
        test("parseAndConvertTypeTemplate", function parseAndConvertTypeTemplateTest() {
            var parseAndConvert = TypeConverter.TypeScript.parseAndConvertTypeTemplate;
            asr.equal(parseAndConvert("bool?", true, true), "boolean?");
            asr.equal(parseAndConvert("UnknownType[]", true, true), "UnknownType[]");
            asr.equal(parseAndConvert("string & IEnumerable[]", true, true), "(string & IEnumerable)[]");
            asr.equal(parseAndConvert("float?[]", true, true), "number?[]");
            asr.equal(parseAndConvert("float?[]", false, false), "number[]");
            asr.throws(function () { return parseAndConvert("UnknownType[]", false, false); });
            asr.equal(parseAndConvert({ typeName: "bool", nullable: true }, true, true), "boolean?");
            asr.equal(parseAndConvert({ typeName: "UnknownType", arrayDimensions: 1 }, true, true), "UnknownType[]");
        });
    });
});
