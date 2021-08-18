﻿/// <reference path="./openapi.d.ts" />

/** Helper functions for converting source code data types to and from common CodeAst.Type and between different languages
 * @author TeamworkGuy2
 */
module TypeConverter {

    /** Convert a CodeAst.Type to a string in the format 'TypeName<GenericParams, ...>[]'
     * @param type the type to stringify
     * @param [typeConverter] an optional converter for the type names in the type
     * @param [includeNullability=true] whether to include type nullability (i.e. the '?' part of 'int?[]')
     * @param [nullableSymbol="?"] the symbol for nullability (i.e. '?' for C# or ' | null' for TypeScript)
     */
    export function typeToString(type: CodeAst.Type, typeConverter?: (typeName: string) => string, includeNullability = true, nullableSymbol = "?"): string {
        var dst: string[] = [];
        _typeToString(type, dst, typeConverter, includeNullability, nullableSymbol);
        return dst.join("");
    }


    function _typeToString(type: CodeAst.Type, dst: string[], typeConverter: ((typeName: string) => string) | null | undefined, includeNullability: boolean, nullableSymbol: string): void {
        dst.push(typeConverter ? typeConverter(type.typeName) : type.typeName);

        var childs = type.genericParameters;
        if (childs && childs.length > 0) {
            dst.push("<");
            for (var i = 0, sizeM1 = childs.length - 1; i < sizeM1; i++) {
                _typeToString(childs[i], dst, typeConverter, includeNullability, nullableSymbol);
                dst.push(", ");
            }
            _typeToString(childs[sizeM1], dst, typeConverter, includeNullability, nullableSymbol);
            dst.push(">");
        }

        if (type.nullable && includeNullability) {
            dst.push(nullableSymbol);
        }

        if (type.arrayDimensions) {
            for (var i = 0, size = dst.length; i < size; i++) {
                var str = dst[i];
                if (str.indexOf("|") > -1 || str.indexOf("&") > -1) {
                    dst.unshift("(");
                    dst.push(")");
                    break;
                }
            }

            dst.push("[]".repeat(type.arrayDimensions));
        }
    }


    /** Parse a simple data type string, the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
     */
    export function parseTypeTemplate(typeTemplate: string): CodeAst.Type {
        var dimensionInfo = parseTypeArrayDimensions(typeTemplate);
        var optionalInfo = parseTypeOptionality(dimensionInfo.type);
        return {
            arrayDimensions: dimensionInfo.dimensionCount,
            typeName: optionalInfo.type,
            nullable: !optionalInfo.required
        };
    }


    function parseTypeArrayDimensions(dataType: string): { type: string; dimensionCount: number } {
        var arrayCount = 0;
        var idx = -1;
        while ((idx = dataType.lastIndexOf("[]")) > -1 && idx === dataType.length - 2) {
            arrayCount++;
            dataType = dataType.substring(0, idx);
        }
        return {
            type: dataType,
            dimensionCount: arrayCount,
        };
    }


    function parseTypeOptionality(dataType: string): { type: string; required: boolean } {
        var lastPos = dataType.length - 1;
        var hasOptionalMark = dataType.charAt(lastPos) === "?";
        return {
            type: hasOptionalMark ? dataType.substr(0, lastPos) : dataType,
            required: !hasOptionalMark,
        };
    }


    /** Check if a type is a primitive C#, Java, or TypeScript data type.
     * (i.e. TypeScript's primitives are boolean and number).
     * @param typeName the simple data type name (i.e. 'number' or 'byte')
     */
    export function isPrimitive(typeName: string): boolean {
        typeName = typeName.toLowerCase();
        switch (typeName) {
            case "bool":
            case "boolean":
            case "byte":
            case "sbyte":
            case "char":
            case "short":
            case "ushort":
            case "int":
            case "uint":
            case "long":
            case "ulong":
            case "float":
            case "double":
            case "decimal":
            case "real":
            case "number":
            case "integer":
                return true;
            default:
                return false;
        }
    }


    /** Check if a type is a core built-in C#, Java, or TypeScript data type.
     * A core type is a widely support type that is core to the language but not a primitive - (i.e. C# has string and DateTime)
     * @param typeName the simple data type name (i.e. 'number' or 'byte')
     */
    export function isCore(typeName: string): boolean {
        typeName = typeName.toLowerCase();
        switch (typeName) {
            case "date":
            case "datetime":
            case "object":
            case "string":
                return true;
            default:
                return false;
        }
    }


    /** Check if a Type contains generic parameters or not
     * @param dataType the CodeAst.Type toe check
     */
    export function isGeneric(dataType: CodeAst.Type) {
        return dataType && dataType.genericParameters != null && dataType.genericParameters.length > 0;
    }


    /** Check whether an object is an Open API Spec type
     * @param obj the object to test
     */
    export function isOpenApiType(obj: any): obj is OpenApiV2.Type {
        return "type" in obj && (obj["type"] === "array" ? "items" in obj : (obj["type"] === "object" ? "properties" in obj : true));
    }


	/** Check whether an object is an Open API Reference type
	 * @param obj the object to test
	 */
	export function isOpenApiReference(obj: any): obj is OpenApiV2.Reference {
		return "$ref" in obj;
	}


    /** Create a deep copy of a CodeAst.Type
     * @see mapType()
     * @param type
     */
    export function cloneType(type: CodeAst.Type): CodeAst.Type {
        return mapType(type);
    }


    /** Recursively copy a generic type using a typeModifier function to modify each generic type along the way
     * @param type the Type to copy
     * @param typeModifier a function which is passed each newly copied Type and can modify them without the changes affecting the original type
     * @return the copied Type after passing it and any nested generic types to the 'typeModifier' function
     */
    export function mapType(type: CodeAst.Type, typeModifier?: (type: CodeAst.Type) => void): CodeAst.Type {
        var srcParams = type.genericParameters;
        var resParams: CodeAst.Type[] = [];
        if (srcParams != null && srcParams.length > 0) {
            for (var i = 0, size = srcParams.length; i < size; i++) {
                var resParam = mapType(srcParams[i], typeModifier);
                resParams.push(resParam);
            }
        }

        var res: CodeAst.Type = {
            arrayDimensions: type.arrayDimensions,
            genericParameters: resParams,
            nullable: type.nullable,
            primitive: type.primitive,
            typeName: type.typeName,
        };

        if (typeModifier != null) {
            typeModifier(res);
        }

        return res;
    }



    /** Functions for transforming and manipulating type information into TypesScript types (i.e. number, boolean, string)
     */
    export module TypeScript {

        /** {@link Date} instance function names that return a string (or number) representation of the date */
        export type DateGetter =
            "getTime" |
            "toDateString" |
            "toISOString" |
            "toJSON" |
            "toLocaleString" |
            "toLocaleDateString" |
            "toLocaleTimeString" |
            "toString" |
            "toTimeString" |
            "toUTCString" |
            "valueOf";


        /** Given a string or a Type, convert either to a TypeScript type:
         * If string, assume it is a simple typeTemplate (see parseAndConvertTypeTemplate()), parse it and convert the types to TypeScript.
         * If Type, convert the types to TypeScript.
         * @param typeTemplate a Type, or string where the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         */
        export function parseTypeTemplate(typeTemplate: string | CodeAst.Type, returnUnknownTypes: boolean): CodeAst.Type {
            if (typeof typeTemplate === "string") {
                var parsedType = TypeConverter.parseTypeTemplate(typeTemplate);
                parsedType.typeName = TypeScript.convertSimpleType(parsedType.typeName, returnUnknownTypes);
                return parsedType;
            }
            else {
                return mapType(typeTemplate, (t) => {
                    t.typeName = TypeScript.convertSimpleType(t.typeName, returnUnknownTypes);
                });
            }
        }


        /** Given a string or a Type, convert either to a TypeScript type string:
         * If given a string, assume it is a simple typeTemplate (see parseAndConvertTypeTemplate()), parse it, convert the types to TypeScript, and convert to a string (see typeToString()).
         * If given a Type, convert the types to TypeScript and convert to a string (see typeToString()).
         * @param typeTemplate a Type, or string where the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         * @param includeNullability
         * @param [nullableSymbol="?"]
         */
        export function parseAndConvertTypeTemplate(typeTemplate: string | CodeAst.Type, returnUnknownTypes: boolean, includeNullability: boolean, nullableSymbol = "?"): string {
            return (typeof typeTemplate === "string"
                ? TypeScript.parseAndConvertTypeTemplateString(typeTemplate, returnUnknownTypes, includeNullability, nullableSymbol)
                : typeToString(typeTemplate, (t) => TypeScript.convertSimpleType(t, returnUnknownTypes), includeNullability, nullableSymbol));
        }


        /** Parse and convert a simple type template string to a TypeScript type string.
         * The format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param typeName the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         * @param includeNullability
         * @param nullableSymbol the symbol to put after nullable types (i.e. '?' for C# or ' | null' for TypeScript)
         */
        export function parseAndConvertTypeTemplateString(typeTemplate: string, returnUnknownTypes: boolean, includeNullability: boolean, nullableSymbol: string): string {
            var typeInfo = TypeConverter.parseTypeTemplate(typeTemplate);
            var arrayCount = typeInfo.arrayDimensions;

            var tsType = TypeScript.convertSimpleType(typeInfo.typeName, returnUnknownTypes);

            tsType += (typeInfo.nullable && includeNullability ? nullableSymbol : "");

            var needsParens = <number>arrayCount > 0 && (tsType.indexOf("|") > -1 || tsType.indexOf("&") > -1);
            if (needsParens) tsType = "(" + tsType + ")";
            return tsType + (<number>arrayCount > 0 ? "[]".repeat(<number>arrayCount) : "");
        }


        /** Convert primitive and common builtin C# and Java types to TypeScript equivalent types
         * @param typeName the type name (i.e. 'bool' or 'String')
         * @param returnUnknownTypes whether to return unknown 'typeName' values or throw an error
         */
        export function convertSimpleType(typeName: string, returnUnknownTypes: boolean): string {
            switch (typeName) {
                case "boolean":
                case "string":
                case "number":
                case "any":
                    return typeName;
                case "bool":
                    return "boolean";
                case "date":
                case "DateTime":
                    return "Date";
                case "String":
                    return "string";
                case "byte":
                case "sbyte":
                case "char":
                case "short":
                case "ushort":
                case "int":
                case "uint":
                case "long":
                case "ulong":
                case "float":
                case "double":
                case "decimal":
                case "real":
                    return "number";
                default:
                    if (returnUnknownTypes) {
                        return typeName;
                    }
                    else {
                        throw new Error("unknown type name for TypeScript code: '" + typeName + "'");
                    }
            }
        }


        /** Create a TypeScript source code string that transforms a specific data type into a string (i.e. stringifies the type)
         * @param typeTemplate a CodeAst.Type or a type template string like 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param variableName the name of the variable
         * @param [dateToString] optional, function that returns source code that converts a given date variable to the format desired, if not provided 'toString()' is used for date/time related types
         * @returns a line of source code that converts the variable from it's given type specified by 'typeTemplate' to a string
         */
        export function createTypeTemplateToStringCode(typeTemplate: string | CodeAst.Type, variableName: string, dateToString?: DateGetter | ((variableName: string) => string)): string {
            var typeInfo = typeof typeTemplate === "string" ? TypeConverter.parseTypeTemplate(typeTemplate) : typeTemplate;

            if (typeInfo.genericParameters != null && typeInfo.genericParameters.length > 0) {
                throw new Error("cannot convert a type containing generic parameters to a string, type = '" + JSON.stringify(typeInfo) + "'");
            }

            var arrayCount = typeInfo.arrayDimensions;
            var typeName = typeInfo.typeName;

            switch (typeName) {
                case "bool":
                case "boolean":
                    if (arrayCount != null && arrayCount > 0) {
                        if (arrayCount > 1) {
                            throw new Error("no source code to string conversion format for " + typeName + "[]".repeat(arrayCount) + "'");
                        }
                        else {
                            return "(" + variableName + " ? Array.prototype.map.call(" + variableName + ", function (v) { return (v ? \"true\" : \"false\"); }) : \"null\")"
                        }
                    }
                    return "(" + variableName + " ? \"true\" : \"false\")";
                case "byte":
                case "sbyte":
                case "char":
                case "short":
                case "ushort":
                case "int":
                case "uint":
                case "long":
                case "ulong":
                case "float":
                case "double":
                case "decimal":
                case "real":
                case "number":
                    if (arrayCount != null && arrayCount > 1) {
                        throw new Error("no source code to string conversion format for " + typeName + "[]".repeat(arrayCount) + "'");
                    }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "date":
                case "DateTime":
                    if (dateToString != null) {
                        if (arrayCount != null && arrayCount > 0) {
                            if (arrayCount > 1) {
                                throw new Error("no source code to string conversion format for '" + typeName + "[]".repeat(arrayCount) + "'");
                            }
                            else {
                                return "(" + variableName + " ? Array.prototype.map.call(" + variableName + ", function (v) { return (v ? " + (typeof dateToString === "string" ? "v." + dateToString + "()" : dateToString("v")) + " : \"null\"); }) : \"null\")"
                            }
                        }
                        return "(" + variableName + " ? " + (typeof dateToString === "string" ? variableName + "." + dateToString + "()" : dateToString(variableName)) + " : \"null\")";
                    }
                case "any":
                    if (arrayCount != null && arrayCount > 1) {
                        throw new Error("no source code to string conversion format for " + typeName + "[]".repeat(arrayCount) + "'");
                    }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "string":
                    return variableName;
                default:
                    throw new Error("unknown type name for TypeScript code: " + typeName);
            }
        }


        /** Convert a map of property names and type templates into an array of TypeScript source code strings that convert each property to a string.
         * @param props maps object property names to their property type templates
         * @params [keys] optional, list of 'props' keys to map, if not provided 'Object.keys()' is used
         * @returns an array of results from calling 'createTypeTemplateToStringCode()' on each property in the 'props' map
         */
        export function createTypeTemplatesToStringCode(props: StringMap<string | CodeAst.Type>, keys?: string[] | null): string[] {
            keys = keys || Object.keys(props);
            return keys.map(k => TypeScript.createTypeTemplateToStringCode(props[k], k));
        }


        /** Create a function which returns the source code string that converts a 'Date' variable into a string (or other type) when given a variable name.
         * Can be used as the 3rd argument ('dateToString') when calling 'createTypeTemplateToStringCode()'
         * @param dateToString the name of the 'Date' function to call on the variable to convert it
         * @param [locale] optional, locale argument to pass to the 'Date' function defined by 'dateFunction'
         * @param [dateTimeFormatOptions] optional, date-time format options to pass to the 'Date' function defined by 'dateFunction'
         */
        export function createDateToStringCodeFunction(dateToString: DateGetter, locale?: string | string[], dateTimeFormatOptions?: Intl.DateTimeFormatOptions) {
            var args = (locale != null || dateTimeFormatOptions != null
                ? (locale != null ? (typeof locale === "string" ? "\"" + locale + "\"" : "[\"" + locale.join("\",\"") + "\"]") : "undefined") +
                    (dateTimeFormatOptions != null ? ", " + JSON.stringify(dateTimeFormatOptions) : "")
                : "");

            var dateStringify = dateToString + "(" + args + ")";

            return function (variableName: string) {
                return variableName + "." + dateStringify;
            };
        }
    }



    export module CSharp {

        /** Convert an Open API Spec type to C# equivalent type.
         * based on: https://swagger.io/specification/#data-types
         * @param typeName the type name (i.e. 'bool' or 'String')
         * @param format the 'format' field (if available) for this 'typeName' in the Open API document
         * @param returnUnknownTypes whether to return unknown 'typeName' values or throw an error
        */
        export function convertOpenApiType(typeName: string, format: string | null | undefined, returnUnknownTypes: boolean): string {
            switch (typeName) {
                case "boolean":
                    return "bool";
                case "integer":
                    return format === "int64" ? "long" : "int";
                case "number":
                    return format === "double" || format === "float" ? format : "int";
                case "string":
                    return format === "date" || format === "date-time" ? "DateTime" : "string";
                default:
                    if (returnUnknownTypes) {
                        return typeName;
                    }
                    else {
                        throw new Error("unknown type name for TypeScript code: '" + typeName + "'");
                    }
            }
        }
    }

}

export = TypeConverter;