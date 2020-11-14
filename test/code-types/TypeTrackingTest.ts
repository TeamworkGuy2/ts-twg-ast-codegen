"use strict";
import chai = require("chai");
import TypeTracking = require("../../code-types/TypeTracking");

var asr = chai.assert;

suite("TypeTracking", function TypeTrackingTest() {
    var clazz: CodeAst.Class = {
        "classSignature": { "access": "PUBLIC", "name": "TestApp.TestClass", "declarationType": "class", "extendClassName": { "typeName": "BaseClass" }, "implementClassNames": [{ "typeName": "IBaseInterface" }], "annotations": [{ "name": "DataContract", "arguments": { "value": "TestApp.TestDataModel" } }] },
        "blockType": "CLASS",
        "using": ["System.Runtime.Serialization"],
        "fields": [
            { "name": "Header", "type": { "typeName": "TestApp.TestDataModel" }, "accessModifiers": ["public"], "annotations": [{ "name": "DataMember", "arguments": {} }], "comments": [] },
            { "name": "Data", "type": { "typeName": "byte", "arrayDimensions": 1, "primitive": true }, "accessModifiers": ["public"], "annotations": [{ "name": "DataMember", "arguments": {} }], "comments": [] }
        ],
        "methods": [{
            "name": "CheckAlpha",
            "parameters": [{ "type": { "typeName": "TestApp.TestDataModel" }, "name": "datum", "parameterModifiers": [] }],
            "accessModifiers": [],
            "annotations": [{ "name": "HttpPost", "arguments": {} }, { "name": "WebInvoke", "arguments": { "ResponseFormat": "DataType.Json", "RequestFormat": "DataType.Json" } }],
            "returnType": { "typeName": "string" },
            "comments": [" <summary>", " Check alpha", " </summary>", " <returns></returns>"]
        }]
    };

    var annotationUse: TypeUsage.Annotation = { class: clazz, annotation: (<CodeAst.Annotation[]>clazz.classSignature.annotations)[0] };
    var fieldUse: TypeUsage.Field = { class: clazz, field: clazz.fields[0] };
    var methodParameterUse: TypeUsage.MethodParameter = { class: clazz, method: clazz.methods[0], parameter: clazz.methods[0].parameters[0] };
    var methodReturnUse: TypeUsage.MethodReturn = { class: clazz, method: clazz.methods[0], returnType: clazz.methods[0].returnType };
    var classExtendsUse: TypeUsage.ClassExtends = { class: clazz, extendType: (<CodeAst.Type>clazz.classSignature.extendClassName).typeName };
    var classImplementsUse: TypeUsage.ClassImplements = { class: clazz, implementType: (<CodeAst.Type[]>clazz.classSignature.implementClassNames)[0].typeName };


    test("isUsage", function isUsageTest() {
        asr.isFalse(TypeTracking.isAnnotationUsage(classImplementsUse));
        asr.isTrue (TypeTracking.isAnnotationUsage(annotationUse));

        asr.isFalse(TypeTracking.isFieldUsage(annotationUse));
        asr.isTrue (TypeTracking.isFieldUsage(fieldUse));

        asr.isFalse(TypeTracking.isMethodParameterUsage(fieldUse));
        asr.isTrue (TypeTracking.isMethodParameterUsage(methodParameterUse));

        asr.isFalse(TypeTracking.isMethodReturnUsage(methodParameterUse));
        asr.isTrue (TypeTracking.isMethodReturnUsage(methodReturnUse));

        asr.isFalse(TypeTracking.isClassExtendsUsage(methodReturnUse));
        asr.isTrue (TypeTracking.isClassExtendsUsage(classExtendsUse));

        asr.isFalse(TypeTracking.isClassImplementsUsage(classExtendsUse));
        asr.isTrue (TypeTracking.isClassImplementsUsage(classImplementsUse));
    });

});
