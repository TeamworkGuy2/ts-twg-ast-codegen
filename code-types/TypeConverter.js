"use strict";
/** Helper functions for converting source code data types to and from common CodeAst.Type and between different languages
 * @author TeamworkGuy2
 */
var TypeConverter;
(function (TypeConverter) {
    /** Convert a CodeAst.Type to a string in the format 'TypeName<GenericParams, ...>[]'
     * @param type the type to stringify
     * @param [typeConverter] an optional converter for the type names in the type
     * @param [includeNullability=true] whether to include type nullability (i.e. the '?' part of 'int?[]')
     * @param [nullableSymbol="?"] the symbol for nullability (i.e. '?' for C# or ' | null' for TypeScript)
     */
    function typeToString(type, typeConverter, includeNullability, nullableSymbol) {
        if (includeNullability === void 0) { includeNullability = true; }
        if (nullableSymbol === void 0) { nullableSymbol = "?"; }
        var dst = [];
        _typeToString(type, dst, typeConverter, includeNullability, nullableSymbol);
        return dst.join("");
    }
    TypeConverter.typeToString = typeToString;
    function _typeToString(type, dst, typeConverter, includeNullability, nullableSymbol) {
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
    function parseTypeTemplate(typeTemplate) {
        var dimensionInfo = parseTypeArrayDimensions(typeTemplate);
        var optionalInfo = parseTypeOptionality(dimensionInfo.type);
        return {
            arrayDimensions: dimensionInfo.dimensionCount,
            typeName: optionalInfo.type,
            nullable: !optionalInfo.required
        };
    }
    TypeConverter.parseTypeTemplate = parseTypeTemplate;
    function parseTypeArrayDimensions(dataType) {
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
    function parseTypeOptionality(dataType) {
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
    function isPrimitive(typeName) {
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
                return true;
            default:
                return false;
        }
    }
    TypeConverter.isPrimitive = isPrimitive;
    /** Check if a type is a core built-in C#, Java, or TypeScript data type.
     * A core type is a widely support type that is core to the language - (i.e. C# has string and DateTime)
     * @param typeName the simple data type name (i.e. 'number' or 'byte')
     */
    function isCore(typeName) {
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
    TypeConverter.isCore = isCore;
    /** Check if a Type contains generic parameters or not
     * @param dataType the CodeAst.Type toe check
     */
    function isGeneric(dataType) {
        return dataType && dataType.genericParameters != null && dataType.genericParameters.length > 0;
    }
    TypeConverter.isGeneric = isGeneric;
    /** Create a deep copy of a CodeAst.Type
     * @see mapType()
     * @param type
     */
    function cloneType(type) {
        return mapType(type);
    }
    TypeConverter.cloneType = cloneType;
    /** Recursively copy a generic type using a typeModifier function to modify each generic type along the way
     * @param type the Type to copy
     * @param typeModifier a function which is passed each newly copied Type and can modify them without the changes affecting the original type
     * @return the copied Type after passing it and any nested generic types to the 'typeModifier' function
     */
    function mapType(type, typeModifier) {
        var srcParams = type.genericParameters;
        var resParams = [];
        if (srcParams != null && srcParams.length > 0) {
            for (var i = 0, size = srcParams.length; i < size; i++) {
                var resParam = mapType(srcParams[i], typeModifier);
                resParams.push(resParam);
            }
        }
        var res = {
            arrayDimensions: type.arrayDimensions,
            genericParameters: resParams,
            nullable: type.nullable,
            typeName: type.typeName,
        };
        if (typeModifier != null) {
            typeModifier(res);
        }
        return res;
    }
    TypeConverter.mapType = mapType;
    /** Functions for transforming and manipulating type information into TypesScript types (i.e. number, boolean, string)
     */
    var TypeScript = /** @class */ (function () {
        function TypeScript() {
        }
        /** Given a string or a Type, convert either to a TypeScript type:
         * If string, assume it is a simple typeTemplate (see parseAndConvertTypeTemplate()), parse it and convert the types to TypeScript.
         * If Type, convert the types to TypeScript.
         * @param typeTemplate a Type, or string where the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         */
        TypeScript.parseTypeTemplate = function (typeTemplate, returnUnknownTypes) {
            if (typeof typeTemplate === "string") {
                var parsedType = TypeConverter.parseTypeTemplate(typeTemplate);
                parsedType.typeName = TypeScript.convertSimpleType(parsedType.typeName, returnUnknownTypes);
                return parsedType;
            }
            else {
                return mapType(typeTemplate, function (t) {
                    t.typeName = TypeScript.convertSimpleType(t.typeName, returnUnknownTypes);
                });
            }
        };
        /** Given a string or a Type, convert either to a TypeScript type string:
         * If given a string, assume it is a simple typeTemplate (see parseAndConvertTypeTemplate()), parse it, convert the types to TypeScript, and convert to a string (see typeToString()).
         * If given a Type, convert the types to TypeScript and convert to a string (see typeToString()).
         * @param typeTemplate a Type, or string where the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         * @param includeNullability
         * @param [nullableSymbol="?"]
         */
        TypeScript.parseAndConvertTypeTemplate = function (typeTemplate, returnUnknownTypes, includeNullability, nullableSymbol) {
            if (nullableSymbol === void 0) { nullableSymbol = "?"; }
            return (typeof typeTemplate === "string"
                ? TypeScript.parseAndConvertTypeTemplateString(typeTemplate, returnUnknownTypes, includeNullability, nullableSymbol)
                : typeToString(typeTemplate, function (t) { return TypeScript.convertSimpleType(t, returnUnknownTypes); }, includeNullability, nullableSymbol));
        };
        /** Parse and convert a simple type template string to a TypeScript type string.
         * The format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param typeName the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         * @param includeNullability
         * @param nullableSymbol the symbol to put after nullable types (i.e. '?' for C# or ' | null' for TypeScript)
         */
        TypeScript.parseAndConvertTypeTemplateString = function (typeTemplate, returnUnknownTypes, includeNullability, nullableSymbol) {
            var typeInfo = TypeConverter.parseTypeTemplate(typeTemplate);
            var arrayCount = typeInfo.arrayDimensions;
            var tsType = TypeScript.convertSimpleType(typeInfo.typeName, returnUnknownTypes);
            tsType += (typeInfo.nullable && includeNullability ? nullableSymbol : "");
            var needsParens = arrayCount > 0 && (tsType.indexOf("|") > -1 || tsType.indexOf("&") > -1);
            if (needsParens)
                tsType = "(" + tsType + ")";
            return tsType + (arrayCount > 0 ? "[]".repeat(arrayCount) : "");
        };
        /** Convert primitive and common builtin C# and Java types to TypeScript equivalent types
         * @param typeName the type name (i.e. 'bool' or 'String')
         * @param returnUnknownTypes
         */
        TypeScript.convertSimpleType = function (typeName, returnUnknownTypes) {
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
        };
        /** Create a TypeScript source code string that transforms a specific data type into a string (i.e. stringifies the type)
         * @param typeTemplate
         * @param variableName
         */
        TypeScript.createTypeTemplateToStringCode = function (typeTemplate, variableName) {
            var typeInfo = typeof typeTemplate === "string" ? TypeConverter.parseTypeTemplate(typeTemplate) : typeTemplate;
            if (typeInfo.genericParameters != null && typeInfo.genericParameters.length > 0) {
                throw new Error("cannot convert a type containing generic parameters to a string, type = '" + JSON.stringify(typeInfo) + "'");
            }
            var arrayCount = typeInfo.arrayDimensions;
            var typeName = typeInfo.typeName;
            switch (typeName) {
                case "bool":
                case "boolean":
                    if (arrayCount > 0) {
                        throw new Error("converting array of " + typeName + " to string not supported");
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
                case "date":
                case "DateTime":
                case "any":
                    if (arrayCount > 0) {
                        throw new Error("converting array of " + typeName + " to strings not supported");
                    }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "string":
                    return variableName;
                default:
                    throw new Error("unknown type name for TypeScript code: " + typeName);
            }
        };
        /** Convert a map of property names and type template strings into an array of TypeScript source code strings that convert each property to a string */
        TypeScript.createTypeTemplatesToStringCode = function (props) {
            var keys = Object.keys(props);
            return keys.map(function (k) { return TypeScript.createTypeTemplateToStringCode(props[k], k); });
        };
        return TypeScript;
    }());
    TypeConverter.TypeScript = TypeScript;
})(TypeConverter || (TypeConverter = {}));
module.exports = TypeConverter;
