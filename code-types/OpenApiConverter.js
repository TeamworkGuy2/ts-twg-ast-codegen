"use strict";
var TypeConverter = require("./TypeConverter");
var OpenApiConverter;
(function (OpenApiConverter) {
    /** Default converter for naming models - nested model names are generated
     * based on their parent model and prop name, e.g. 'Root_propName_subPropName...'
     * @param nameStack the stack of model names forming a path through the OpenAPI models that lead up to this model being named
     */
    OpenApiConverter.defaultModelNamer = function (nameStack) {
        return nameStack.join("_");
    };
    function extractOpenApiModels(openApiDefinitions, modelNamer) {
        if (modelNamer === void 0) { modelNamer = OpenApiConverter.defaultModelNamer; }
        var models = {};
        for (var defName in openApiDefinitions) {
            var def = openApiDefinitions[defName];
            readType([defName], def, function (clazz) {
                var clsName = clazz.classSignature.name;
                if (models[clsName] != null)
                    throw new Error("duplicate model name '" + clsName + "'");
                models[clsName] = clazz;
            }, openApiDefinitions, modelNamer);
        }
        return models;
    }
    OpenApiConverter.extractOpenApiModels = extractOpenApiModels;
    function createModelParameterFromType(paramName, openApiType, openApiDefinitions, modelNamer) {
        if (modelNamer === void 0) { modelNamer = OpenApiConverter.defaultModelNamer; }
        var models = {};
        var field = readType([paramName], openApiType, function (clazz) {
            var clsName = clazz.classSignature.name;
            if (models[clsName] != null)
                throw new Error("duplicate model name '" + clsName + "'");
            models[clsName] = clazz;
        }, openApiDefinitions || null, modelNamer);
        return {
            parameter: {
                name: paramName,
                type: field.type,
                parameterModifiers: ["public"],
                annotations: field.annotations,
            },
            classes: models,
        };
    }
    OpenApiConverter.createModelParameterFromType = createModelParameterFromType;
    /** Extract CodeAst.Class and CodeAst.Field models from an OAS JSON type definition
     * @param nameStack the names of the 'oasType's from the recursive call up to this point, used recursively to track property names
     * @param oasType the OAS JSON type to convert recursively
     * @param objectVisitor called for each complete object model read
     * @param [oasDefs] optional, the OpenAPI document root 'definitions' for looking up '$ref' types
     * @param [modelNamer] optional (default: 'defaultModelNamer') a function which converts model name stack to a model name
     */
    function readType(nameStack, oasType, objectVisitor, oasDefs, modelNamer) {
        // '$ref' Reference
        if (isOpenApiReference(oasType)) {
            if (oasDefs != null) {
                var refType = queryJsonPath(oasType.$ref, oasDefs, ["definitions"]);
                if (refType == null) {
                    throw new Error("reference type not found '" + oasType.$ref + "'");
                }
                return readType(nameStack, refType, objectVisitor, oasDefs, modelNamer);
            }
            else {
                throw new Error("document 'definitions' not provided, cannot follow reference '" + oasType.$ref + "'");
            }
        }
        // 'allOf' schema
        else if (isOpenApiAllOf(oasType)) {
            // load all the 'allOf' types
            var allTypes = [];
            for (var _i = 0, _a = oasType.allOf; _i < _a.length; _i++) {
                var allType = _a[_i];
                var allTypeField = readType(nameStack, allType, objectVisitor, oasDefs, modelNamer);
                allTypes.push(allTypeField.type);
            }
            // create a synthetic class that extends all of the 'allOf' types
            var objType = createOpenApiClass(nameStack, [], modelNamer);
            objType.classSignature.implementClassNames = addAll(objType.classSignature.implementClassNames, allTypes);
            objType.classSignature.annotations = addAll(objType.classSignature.annotations, [{ name: "AllOf", arguments: { value: "['" + allTypes.map(function (type) { return TypeConverter.typeToString(type); }).join("', '") + "']" } }]);
            objectVisitor(objType);
            return {
                name: last(nameStack),
                type: {
                    typeName: objType.classSignature.name,
                },
                accessModifiers: ["public"],
            };
        }
        // array
        else if (oasType.type === "array") {
            var item = readType(nameStack, oasType.items, objectVisitor, oasDefs, modelNamer);
            item.type.arrayDimensions = (item.type.arrayDimensions || 0) + 1;
            return item;
        }
        // object
        else if (oasType.type === "object") {
            var fields = [];
            for (var propName in oasType.properties) {
                var prop = oasType.properties[propName];
                nameStack.push(propName);
                var field = readType(nameStack, prop, objectVisitor, oasDefs, modelNamer);
                nameStack.pop();
                fields.push(field);
            }
            var extendsTypes = [];
            var annotations = [];
            if (oasType.additionalProperties != null) {
                if (typeof oasType.additionalProperties === "boolean") {
                    annotations.push({ name: "AdditionalProperties", arguments: { value: "true" } });
                }
                else {
                    var additionalPropsType = readType(nameStack, oasType.additionalProperties, objectVisitor, oasDefs, modelNamer);
                    extendsTypes.push(additionalPropsType.type);
                }
            }
            // create a class that contains all the fields
            var objType = createOpenApiClass(nameStack, fields, modelNamer);
            if (extendsTypes.length > 0) {
                objType.classSignature.implementClassNames = addAll(objType.classSignature.implementClassNames, extendsTypes);
            }
            if (annotations.length > 0) {
                objType.classSignature.annotations = addAll(objType.classSignature.annotations, annotations);
            }
            objectVisitor(objType);
            // return a synthetic field based on the class
            return {
                name: last(nameStack),
                type: {
                    typeName: objType.classSignature.name,
                },
                accessModifiers: ["public"],
            };
        }
        // primitive
        else {
            var annotations = [];
            if (oasType.type === "string" && (oasType.minLength != null || oasType.maxLength != null)) {
                var annArgs = {};
                if (oasType.minLength != null) {
                    annArgs["min"] = String(oasType.minLength);
                }
                if (oasType.maxLength != null) {
                    annArgs["max"] = String(oasType.maxLength);
                }
                annotations.push({ name: "StringLength", arguments: annArgs });
            }
            if (oasType.type === "string" && oasType.enum != null) {
                annotations.push({ name: "EnumOf", arguments: { value: "['" + oasType.enum.map(function (enm) { return String(enm); }).join("', '") + "']" } });
            }
            var field = {
                name: last(nameStack),
                type: {
                    typeName: (oasType.format || oasType.type),
                    arrayDimensions: 0,
                    primitive: true,
                },
                accessModifiers: ["public"],
                annotations: annotations,
                comments: !(oasType.description == null || oasType.description.length === 0) ? [oasType.description] : undefined,
                required: false,
            };
            return field;
        }
    }
    /** Check whether an object is an Open API spec 'Type'
     * @param obj the object to test
     */
    function isOpenApiType(obj) {
        return obj != null && "type" in obj && (obj["type"] === "array" ? "items" in obj : (obj["type"] === "object" ? "properties" in obj : true));
    }
    OpenApiConverter.isOpenApiType = isOpenApiType;
    /** Check whether an object is an Open API spec 'Schema AllOf'
     * @param obj the object to test
     */
    function isOpenApiAllOf(obj) {
        return obj != null && "allOf" in obj;
    }
    OpenApiConverter.isOpenApiAllOf = isOpenApiAllOf;
    /** Check whether an object is an Open API spec 'Reference'
     * @param obj the object to test
     */
    function isOpenApiReference(obj) {
        return obj != null && "$ref" in obj;
    }
    OpenApiConverter.isOpenApiReference = isOpenApiReference;
    /** Follow a JSON path in the format '#/path/to/value'
     * @param path the path, separated by '/'
     * @param obj the object to traverse
     * @param [skipParts] optional, array of 'path' parts to skip if the path starts with them (i.e. a way to query a non-root 'obj')
     * @returns the value from 'obj' from following 'path' or null if obj is null or null is encountered while following the path
     */
    function queryJsonPath(path, obj, skipParts) {
        var parts = path.split("/");
        if (parts[0] !== "#") {
            throw new Error("relative JSON path not supported, expected to start with '#' but was '" + path + "'");
        }
        var res = obj;
        var i = 1;
        if (hasAny(skipParts)) {
            for (var skipCount = skipParts.length; i < skipCount + 1; i++) {
                if (parts[i] !== skipParts[i - 1]) {
                    break;
                }
            }
        }
        for (var size = parts.length; i < size; i++) {
            if (res == null) {
                break;
            }
            res = res[parts[i]];
        }
        return res;
    }
    OpenApiConverter.queryJsonPath = queryJsonPath;
    function createOpenApiClass(nameStack, fields, modelNamer) {
        return {
            classSignature: {
                name: modelNamer(nameStack),
                declarationType: "class",
                access: "public",
                annotations: [{ name: "OpenApiModel", arguments: { type: nameStack.join(".") } }],
            },
            blockType: "CLASS",
            using: [],
            fields: fields,
            methods: [],
        };
    }
    function addAll(target, ary) {
        var res = target != null ? Array.prototype.slice.call(target) : [];
        Array.prototype.push.apply(res, ary);
        return res;
    }
    function hasAny(ary) {
        return ary != null && ary.length > 0;
    }
    function last(ary) {
        return ary.length > 0 ? ary[ary.length - 1] : null;
    }
})(OpenApiConverter || (OpenApiConverter = {}));
module.exports = OpenApiConverter;
