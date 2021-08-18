import TypeConverter = require("./TypeConverter");

module OpenApiConverter {
    /** The property name used for detecting 'anyOf' schemas, since this isn't part of the Open API v2 spec */
    export var anyOfProp = <"anyOf">"anyOf";

    /** Default converter for naming models - nested model names are generated
     * based on their parent model and prop name, e.g. 'Root_propName_subPropName...'
     * @param nameStack the stack of model names forming a path through the OpenAPI models that lead up to this model being named
     */
    export var defaultModelNamer: (nameStack: string[]) => string = function (nameStack) {
        return nameStack.join("_");
    };

    /** Default converter for types in model fields
     * @param typeName the Open API type name, e.g. 'number' or 'integer'
     * @param [format] optional, format of the type, e.g. 'int64' or 'float'
     */
    export var defaultTypeConverter: (typeName: string, format?: string | null) => CodeAst.Type = function (typeName, format) {
        if (TypeConverter.isPrimitive(typeName)) {
            return {
                typeName: format || typeName,
                primitive: true,
            };
        }
        else {
            return {
                typeName: format || typeName,
            };
        }
    };


    export function extractOpenApiModels(openApiDefinitions: OpenApiV2.Definitions, modelNamer = defaultModelNamer, typeConverter = defaultTypeConverter): StringMap<CodeAst.Class> {
        var models = <StringMap<CodeAst.Class>>{};

        for (var defName in openApiDefinitions) {
            var def = openApiDefinitions[defName];

            readType([defName], def, (clazz) => {
                var clsName = clazz.classSignature.name;
                if (models[clsName] != null) throw new Error("duplicate model name '" + clsName + "'");
                models[clsName] = clazz;
            }, openApiDefinitions, modelNamer, typeConverter);
        }

        return models;
    }


    export function createModelParameterFromType(paramName: string, paramType: OpenApiV2.Type, openApiDefinitions?: OpenApiV2.Definitions, modelNamer = defaultModelNamer, typeConverter = defaultTypeConverter
    ): { parameter: CodeAst.MethodParameter; classes: StringMap<CodeAst.Class> } {
        var models = <StringMap<CodeAst.Class>>{};

        var field = readType([paramName], paramType, (clazz) => {
            var clsName = clazz.classSignature.name;
            if (models[clsName] != null) throw new Error("duplicate model name '" + clsName + "'");
            models[clsName] = clazz;
        }, openApiDefinitions || null, modelNamer, typeConverter);

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


    /** Extract CodeAst.Class and CodeAst.Field models from an Open API JSON type definition
     * @param nameStack the names of the 'openApiType' models that lead to this point, used recursively to track nested type names
     * @param openApiType the Open API JSON type to convert recursively
     * @param objectVisitor called for each complete object model read
     * @param [openApiDefinitions] optional, the OpenAPI document root 'definitions' for looking up '$ref' types
     * @param modelNamer (default: 'defaultModelNamer') a function which converts model name stack to a model name
     * @param typeConverter (default: 'defaultTypeConverter') a function which converts type names and format hints to 'CodeAst.Type' types
     */
    export function readType(nameStack: string[], openApiType: (OpenApiV2.Schema | OpenApiV2.Type | OpenApiV2.Reference), objectVisitor: (clazz: CodeAst.Class) => void, openApiDefinitions: OpenApiV2.Definitions | null,
        modelNamer: (nameStack: string[]) => string, typeConverter: (typeName: string, format?: string | null) => CodeAst.Type
    ): CodeAst.Field {
        // '$ref' Reference
        if (isOpenApiReference(openApiType)) {
            if (openApiDefinitions != null) {
                var refType = queryJsonPath(openApiType.$ref, openApiDefinitions, ["definitions"]);
                if (refType == null) {
                    throw new Error("reference type not found '" + openApiType.$ref + "'");
                }
                nameStack.push(last(openApiType.$ref.split("/")))
                var resType = readType(nameStack, refType, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
                nameStack.pop();
                resType.name = last(nameStack); // avoid '$ref' fields getting named after their '$ref' definition/model instead of the field they come from
                return resType;
            }
            else {
                throw new Error("document 'definitions' not provided, cannot follow reference '" + openApiType.$ref + "'");
            }
        }
        // 'allOf' schema
        else if (isOpenApiAllOf(openApiType)) {
            // load all the 'allOf' types
            var allTypes: CodeAst.Type[] = [];
            for (var allType of openApiType.allOf) {
                var allTypeField = readType(nameStack, allType, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
                allTypes.push(allTypeField.type);
            }

            // create a synthetic class that extends all of the 'allOf' types
            var objType = createOpenApiClass(nameStack, [], modelNamer);
            objType.classSignature.implementClassNames = addAll(objType.classSignature.implementClassNames, allTypes);

            objType.classSignature.annotations = addAll(objType.classSignature.annotations, [{ name: "AllOf", arguments: { value: JSON.stringify(allTypes.map((type) => TypeConverter.typeToString(type))).replace(/\",\"/g, "\", \"") } }]);

            objectVisitor(objType);

            return {
                name: last(nameStack),
                type: typeConverter(objType.classSignature.name),
                accessModifiers: ["public"],
            };
        }
        // 'anyOf' schema
        else if (isOpenApiAnyOf(openApiType, anyOfProp)) {
            // load all the 'allOf' types
            var anyTypes: CodeAst.Type[] = [];
            for (var anyType of openApiType[anyOfProp]) {
                var anyTypeField = readType(nameStack, anyType, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
                anyTypes.push(anyTypeField.type);
            }

            // create a synthetic type union of all the 'anyOf' types
            var objType = createOpenApiClass(nameStack, [], modelNamer);
            objType.classSignature.implementClassNames = addAll(objType.classSignature.implementClassNames, anyTypes);

            objType.classSignature.annotations = addAll(objType.classSignature.annotations, [{ name: "AnyOf", arguments: { value: JSON.stringify(anyTypes.map((type) => TypeConverter.typeToString(type))).replace(/\",\"/g, "\", \"") } }]);

            objectVisitor(objType);

            return {
                name: last(nameStack),
                type: typeConverter(objType.classSignature.name),
                accessModifiers: ["public"],
            };
        }
        // array
        else if (openApiType.type === "array") {
            var item = readType(nameStack, openApiType.items, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
            item.type.arrayDimensions = (item.type.arrayDimensions || 0) + 1;
            return item;
        }
        // object
        else if (openApiType.type === "object") {
            var required = openApiType.required || [];
            var fields: CodeAst.Field[] = [];

            for (var propName in openApiType.properties) {
                var prop = openApiType.properties[propName];

                nameStack.push(propName);
                var field = readType(nameStack, prop, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
                nameStack.pop();

                field.required = required.indexOf(field.name) > -1;

                fields.push(field);
            }

            var extendsTypes: CodeAst.Type[] = [];
            var annotations: CodeAst.Annotation[] = []
            if (openApiType.additionalProperties != null) {
                if (typeof openApiType.additionalProperties === "boolean") {
                    annotations.push({ name: "AdditionalProperties", arguments: { value: "true" } });
                }
                else {
                    var additionalPropsType = readType(nameStack, openApiType.additionalProperties, objectVisitor, openApiDefinitions, modelNamer, typeConverter);
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
                type: typeConverter(objType.classSignature.name),
                accessModifiers: ["public"],
            };
        }
        // primitive
        else {
            var annotations: CodeAst.Annotation[] = [];
            if (openApiType.type === "string" && ((<OpenApiV2.SchemaString><any>openApiType).minLength != null || openApiType.maxLength != null)) {
                var annArgs: StringMap<string> = {};
                if ((<OpenApiV2.SchemaString><any>openApiType).minLength != null) {
                    annArgs["min"] = String((<OpenApiV2.SchemaString><any>openApiType).minLength);
                }
                if (openApiType.maxLength != null) {
                    annArgs["max"] = String(openApiType.maxLength);
                }
                annotations.push({ name: "StringLength", arguments: annArgs });
            }
            if (openApiType.type === "string" && openApiType.enum != null) {
                annotations.push({ name: "EnumOf", arguments: { value: JSON.stringify(openApiType.enum.map((enm) => String(enm))).replace(/\",\"/g, "\", \"") } });
            }

            var field: CodeAst.Field = {
                name: last(nameStack),
                type: typeConverter(openApiType.type, openApiType.format),
                accessModifiers: ["public"],
                annotations: annotations,
                comments: !(openApiType.description == null || openApiType.description.length === 0) ? [openApiType.description] : undefined,
                required: false,
            };
            return field;
        }
    }


    /** Check whether an object is an Open API spec 'Type'
     * @param obj the object to test
     */
    export function isOpenApiType(obj: any): obj is OpenApiV2.Type {
        return obj != null && "type" in obj && (obj["type"] === "array" ? "items" in obj : (obj["type"] === "object" ? "properties" in obj : true));
    }


    /** Check whether an object is an Open API spec 'Schema AllOf'
     * @param obj the object to test
     */
    export function isOpenApiAllOf(obj: any): obj is OpenApiV2.SchemaAllOf {
        return obj != null && "allOf" in obj;
    }


    /** Check whether an object is an Open API spec 'Schema AllOf'
     * @param obj the object to test
     */
    export function isOpenApiAnyOf<K extends string>(obj: any, prop: K): obj is { [P in K]: (OpenApiV2.Schema | OpenApiV2.Reference)[] } {
        return obj != null && prop in obj;
    }


    /** Check whether an object is an Open API spec 'Reference'
     * @param obj the object to test
     */
    export function isOpenApiReference(obj: any): obj is OpenApiV2.Reference {
        return obj != null && "$ref" in obj;
    }


    /** Follow a JSON path in the format '#/path/to/value'
     * @param path the path, separated by '/'
     * @param obj the object to traverse
     * @param [skipParts] optional, array of 'path' parts to skip if the path starts with them (i.e. a way to query a non-root 'obj')
     * @returns the value from 'obj' from following 'path' or null if obj is null or null is encountered while following the path
     */
    export function queryJsonPath(path: string, obj: any, skipParts?: string[]) {
        var parts = path.split("/");

        if (parts[0] !== "#") {
            throw new Error("relative JSON path not supported, expected to start with '#' but was '" + path + "'");
        }

        var res = obj;
        var i = 1;

        if (skipParts != null) {
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


    function createOpenApiClass(nameStack: string[], fields: CodeAst.Field[], modelNamer: (nameStack: string[]) => string): CodeAst.Class {
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


    function addAll<T>(target: ArrayLike<T> | null | undefined, ary: ArrayLike<T>): T[] {
        var res = target != null ? Array.prototype.slice.call(target) : [];
        Array.prototype.push.apply(res, <any[]><any>ary);
        return res;
    }


    function last<T>(ary: T[]): T {
        return ary.length > 0 ? ary[ary.length - 1] : <any>null;
    }

}

export = OpenApiConverter;