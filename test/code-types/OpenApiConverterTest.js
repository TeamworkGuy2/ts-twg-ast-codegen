"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var OpenApiConverter = require("../../code-types/OpenApiConverter");
var asr = chai.assert;
suite("OpenApiConverter", function OpenApiConverterTest() {
    test("isOpenApiType()", function () {
        asr.isFalse(OpenApiConverter.isOpenApiType(null));
        asr.isFalse(OpenApiConverter.isOpenApiType({}));
        asr.isTrue(OpenApiConverter.isOpenApiType(openApiType({ type: "number", format: "int32" })));
        asr.isTrue(OpenApiConverter.isOpenApiType(openApiType({ type: "array", items: { type: "boolean" } })));
        asr.isTrue(OpenApiConverter.isOpenApiType(openApiType({ type: "object", properties: { key: { $ref: "#/definitions/Key" } } })));
    });
    test("isOpenApiReference()", function () {
        asr.isFalse(OpenApiConverter.isOpenApiReference(null));
        asr.isFalse(OpenApiConverter.isOpenApiReference({}));
        asr.isTrue(OpenApiConverter.isOpenApiReference({ $ref: "" }));
        asr.isTrue(OpenApiConverter.isOpenApiReference({ $ref: "#/definitions/Key" }));
    });
    test("extractOpenApiModels() #1", function () {
        var models = OpenApiConverter.extractOpenApiModels({
            SimpleType: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    value: { type: "integer", format: "int64" },
                }
            },
            ReferenceType: {
                $ref: "#/definitions/SimpleType"
            }
        });
        var definitions = {
            "SimpleType": {
                using: [],
                blockType: "CLASS",
                classSignature: { name: "SimpleType", declarationType: "class", access: "public", annotations: [{ name: "OpenApiModel", arguments: { type: "SimpleType" } }] },
                fields: [{
                        name: "name",
                        type: { typeName: "string", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }, {
                        name: "value",
                        type: { typeName: "int64", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }],
                methods: [],
            },
            "ReferenceType": {
                using: [],
                blockType: "CLASS",
                classSignature: { name: "ReferenceType", declarationType: "class", access: "public", annotations: [{ name: "OpenApiModel", arguments: { type: "ReferenceType" } }] },
                fields: [],
                methods: [],
            }
        };
        definitions.ReferenceType.fields = definitions.SimpleType.fields.slice();
        asr.deepEqual(models, definitions);
    });
    test("extractOpenApiModels() #2", function () {
        var models = OpenApiConverter.extractOpenApiModels({
            Category: {
                type: "object",
                required: ["name"],
                properties: {
                    id: { type: "integer", format: "int64" },
                    name: { type: "string", minLength: 2 }
                }
            },
            Tag: {
                type: "object",
                properties: {
                    tagId: { type: "integer", format: "int64" },
                    description: { type: "string" }
                }
            }
        });
        var definitions = {
            Category: {
                using: [],
                blockType: "CLASS",
                classSignature: { name: "Category", declarationType: "class", access: "public", annotations: [{ name: "OpenApiModel", arguments: { type: "Category" } }] },
                fields: [{
                        name: "id",
                        type: { typeName: "int64", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }, {
                        name: "name",
                        type: { typeName: "string", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [{ name: "StringLength", arguments: { min: "2" } }],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }],
                methods: [],
            },
            Tag: {
                using: [],
                blockType: "CLASS",
                classSignature: { name: "Tag", declarationType: "class", access: "public", annotations: [{ name: "OpenApiModel", arguments: { type: "Tag" } }] },
                fields: [{
                        name: "tagId",
                        type: { typeName: "int64", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }, {
                        name: "description",
                        type: { typeName: "string", primitive: true, arrayDimensions: 0 },
                        required: false,
                        annotations: [],
                        accessModifiers: ["public"],
                        comments: undefined,
                    }],
                methods: [],
            }
        };
        asr.deepEqual(models, definitions);
    });
    test("createModelParameterFromType()", function () {
        var _a = OpenApiConverter.createModelParameterFromType("firstParam", {
            type: "object",
            properties: {
                sid: { type: "string", format: "uniqueidentifier" }
            },
            additionalProperties: true,
        }), parameter = _a.parameter, classes = _a.classes;
        asr.deepEqual(classes, {
            firstParam: {
                blockType: "CLASS",
                classSignature: {
                    name: "firstParam",
                    access: "public",
                    annotations: [
                        { name: "OpenApiModel", arguments: { type: "firstParam" } },
                        { name: "AdditionalProperties", arguments: { value: "true" } }
                    ],
                    declarationType: "class"
                },
                fields: [{
                        name: "sid",
                        type: { typeName: "uniqueidentifier", arrayDimensions: 0, primitive: true },
                        accessModifiers: ["public"],
                        annotations: [],
                        comments: undefined,
                        required: false
                    }],
                methods: [],
                using: [],
            }
        });
        asr.deepEqual(parameter, {
            name: "firstParam",
            parameterModifiers: ["public"],
            type: { typeName: "firstParam" },
            annotations: undefined
        });
    });
    function openApiType(obj) {
        return obj;
    }
});
