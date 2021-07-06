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


    test("cloneType", function cloneTypeTest() {
        asr.deepEqual(TypeConverter.cloneType({ typeName: "string" }),
            { typeName: "string", arrayDimensions: undefined, genericParameters: [], nullable: undefined, primitive: undefined });

        asr.deepEqual(TypeConverter.cloneType({ typeName: "string", arrayDimensions: 1 }),
            { typeName: "string", arrayDimensions: 1, genericParameters: [], nullable: undefined, primitive: undefined });

        asr.deepEqual(TypeConverter.cloneType({ typeName: "IList", genericParameters: [{ typeName: "int", primitive: true }] }),
            { typeName: "IList", genericParameters: [{ typeName: "int", primitive: true, arrayDimensions: undefined, genericParameters: [], nullable: undefined }], arrayDimensions: undefined, nullable: undefined, primitive: undefined });

        asr.deepEqual(TypeConverter.cloneType({ typeName: "int", arrayDimensions: 0, nullable: true, primitive: true }),
            { typeName: "int", arrayDimensions: 0, nullable: true, primitive: true, genericParameters: [] });
    });


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
            var toCode = TypeConverter.TypeScript.createTypeTemplateToStringCode;

            asr.equal(toCode({ typeName: "boolean" }, "myVal"), "(myVal ? \"true\" : \"false\")");
            asr.equal(toCode({ typeName: "number" }, "myVal"), "(myVal ? myVal.toString() : \"null\")");
            asr.equal(toCode({ typeName: "byte" }, "v"), "(v ? v.toString() : \"null\")");
            asr.equal(toCode({ typeName: "uint" }, "_"), "(_ ? _.toString() : \"null\")");
            asr.equal(toCode({ typeName: "date" }, "va"), "(va ? va.toString() : \"null\")");
            asr.equal(toCode({ typeName: "boolean", arrayDimensions: 1 }, "flags"), "(flags ? Array.prototype.map.call(flags, function (v) { return (v ? \"true\" : \"false\"); }) : \"null\")");
            asr.equal(toCode({ typeName: "float", arrayDimensions: 1 }, "ff"), "(ff ? ff.toString() : \"null\")");

            asr.throws(() => toCode({ typeName: "real", arrayDimensions: 2 }, "v"));
        });


        test("runCreateTypeTemplateToStringCode", function runCreateTypeTemplateToStringCodeTest() {
            function runToCode(type: CodeAst.Type, value: any, varName = "v", dateToStringFunction?: TypeConverter.TypeScript.DateGetter | ((variableName: string) => string)) {
                var code = TypeConverter.TypeScript.createTypeTemplateToStringCode(type, varName, dateToStringFunction);
                var func = new Function(varName, "return " + code);
                return func(value);
            }

            asr.equal(runToCode({ typeName: "boolean" }, true), "true");
            asr.equal(runToCode({ typeName: "number" }, null), "null")
            asr.equal(runToCode({ typeName: "float", arrayDimensions: 1 }, [0, 1, 2.5, 3.141592]), "0,1,2.5,3.141592")
            asr.equal(runToCode({ typeName: "date" }, new Date(2020, 1, 2, 17)), new Date(2020, 1, 2, 17).toString()); // default is 'Date.toString()'
            asr.equal(runToCode({ typeName: "date" }, new Date(2020, 1, 2, 17), "t", "toISOString"), new Date(2020, 1, 2, 17).toISOString());

            var dateToIsoStringFunc = TypeConverter.TypeScript.createDateToStringCodeFunction("toISOString");
            asr.equal(runToCode({ typeName: "date" }, new Date(2020, 11, 24), "t", dateToIsoStringFunc), new Date(2020, 11, 24).toISOString());

            var dateToIsoStringFunc = TypeConverter.TypeScript.createDateToStringCodeFunction("toLocaleString", undefined, { hour12: false });
            asr.equal(runToCode({ typeName: "date" }, new Date(2020, 1, 29, 19), "t", dateToIsoStringFunc), new Date(2020, 1, 29, 19).toLocaleString(undefined, { hour12: false }));
        });


        test("parseAndConvertTypeTemplate", function parseAndConvertTypeTemplateTest() {
            var parseAndConvert = TypeConverter.TypeScript.parseAndConvertTypeTemplate;

            asr.equal(parseAndConvert("bool?", true, true), "boolean?");
            asr.equal(parseAndConvert("UnknownType[]", true, true), "UnknownType[]");
            asr.equal(parseAndConvert("string & IEnumerable[]", true, true), "(string & IEnumerable)[]");
            asr.equal(parseAndConvert("float?[]", true, true), "number?[]");

            asr.equal(parseAndConvert("float?[]", false, false), "number[]");
            asr.throws(() => parseAndConvert("UnknownType[]", false, false));

            asr.equal(parseAndConvert({ typeName: "bool", nullable: true }, true, true), "boolean?");
            asr.equal(parseAndConvert({ typeName: "UnknownType", arrayDimensions: 1 }, true, true), "UnknownType[]");
        });
    });

});
