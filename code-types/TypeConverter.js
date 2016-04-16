"use strict";
/** TypeConverter - functions for converting source code data types between different languages
 * @author TeamworkGuy2
 */
var TypeConverter;
(function (TypeConverter) {
    var TypeScript = (function () {
        function TypeScript() {
        }
        // true if the type is optional, false if not
        TypeScript.parseType = function (dataType) {
            var optionalInfo = TypeScript.parseTypeOptionality(dataType);
            var dimensionInfo = TypeScript.parseTypeArrayDimensions(optionalInfo.type);
            return {
                arrayDimensionCount: dimensionInfo.dimensionCount,
                type: dimensionInfo.type,
                required: optionalInfo.required
            };
        };
        TypeScript.parseTypeOptionality = function (dataType) {
            var hasOptionalMark = dataType.charAt(dataType.length - 1) === "?";
            return {
                type: hasOptionalMark ? dataType.substr(0, dataType.length - 1) : dataType,
                required: !hasOptionalMark,
            };
        };
        TypeScript.parseTypeArrayDimensions = function (dataType) {
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
        };
        TypeScript.parseCsOrJavaType = function (dataType, returnUnknownTypes) {
            var optionalInfo = TypeScript.parseType(dataType);
            var arrayCount = optionalInfo.arrayDimensionCount;
            dataType = optionalInfo.type;
            var tsType = null;
            switch (dataType) {
                case "boolean":
                case "string":
                case "number":
                case "any":
                    tsType = dataType;
                    break;
                case "bool":
                    tsType = "boolean";
                    break;
                case "date":
                case "DateTime":
                    tsType = "Date";
                    break;
                case "String":
                    tsType = "string";
                    break;
                case "byte":
                case "sbyte":
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
                    tsType = "number";
                    break;
                default:
                    if (returnUnknownTypes) {
                        tsType = dataType;
                    }
                    else {
                        throw new Error("unknown type name for TypeScript code: '" + dataType + "'");
                    }
            }
            return tsType + (arrayCount > 0 ? new Array(arrayCount + 1).join("[]") : "");
        };
        TypeScript.isPrimitiveOrBuiltInType = function (dataType, includeBuiltInTypes) {
            dataType = dataType.toLowerCase();
            switch (dataType) {
                case "bool":
                case "boolean":
                case "byte":
                case "sbyte":
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
                    if (includeBuiltInTypes) {
                        switch (dataType) {
                            case "date":
                            case "datetime":
                            case "string":
                                return true;
                            default:
                                return false;
                        }
                    }
                    return false;
            }
        };
        TypeScript.createTypeToStringCode = function (dataType, variableName) {
            var optionalInfo = TypeScript.parseType(dataType);
            var arrayCount = optionalInfo.arrayDimensionCount;
            dataType = optionalInfo.type;
            switch (dataType) {
                case "bool":
                case "boolean":
                    if (arrayCount > 0) {
                        throw new Error("converting array of " + dataType + " to string not supported");
                    }
                    return "(" + variableName + " ? \"true\" : \"false\")";
                case "date":
                case "DateTime":
                case "any":
                case "number":
                case "int":
                case "long":
                case "float":
                case "decimal":
                case "real":
                    if (arrayCount > 0) {
                        throw new Error("converting array of " + dataType + " to strings not supported");
                    }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "string":
                    return variableName;
                default:
                    throw new Error("unknown type name for TypeScript code: " + dataType);
            }
        };
        /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string */
        TypeScript.createTypesToStringCode = function (props) {
            var keys = Object.keys(props);
            return keys.map(function (k) { return TypeScript.createTypeToStringCode(props[k].type, k); });
        };
        TypeScript.typeToString = function (type, typeConverter) {
            var dst = [];
            TypeScript._genericTypeToString(type, typeConverter, dst);
            return dst.join("");
        };
        TypeScript._genericTypeToString = function (type, typeConverter, dst) {
            dst.push(typeConverter ? typeConverter(type.typeName) : type.typeName);
            var childs = type.genericParameters;
            if (childs && childs.length > 0) {
                for (var i = 0, sizeM1 = childs.length - 1; i < sizeM1; i++) {
                    TypeScript._genericTypeToString(childs[i], typeConverter, dst);
                    dst.push(", ");
                }
                TypeScript._genericTypeToString(childs[sizeM1], typeConverter, dst);
            }
            if (type.arrayDimensions) {
                dst.push(new Array(type.arrayDimensions + 1).join("[]"));
            }
        };
        return TypeScript;
    }());
    TypeConverter.TypeScript = TypeScript;
})(TypeConverter || (TypeConverter = {}));
module.exports = TypeConverter;
