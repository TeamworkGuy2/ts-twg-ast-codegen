"use strict";

/** TypeConverter - functions for converting source code data types between different languages
 * @author TeamworkGuy2
 */
module TypeConverter {


    export function typeToString(type: CodeAst.Type, typeConverter?: (typeName: string) => string): string {
        var dst: string[] = [];
        _genericTypeToString(type, dst, typeConverter);
        return dst.join("");
    }


    function _genericTypeToString(type: CodeAst.Type, dst: string[], typeConverter?: (typeName: string) => string): void {
        dst.push(typeConverter ? typeConverter(type.typeName) : type.typeName);

        var childs = type.genericParameters;
        if (childs && childs.length > 0) {
            dst.push("<");
            for (var i = 0, sizeM1 = childs.length - 1; i < sizeM1; i++) {
                _genericTypeToString(childs[i], dst, typeConverter);
                dst.push(", ");
            }
            _genericTypeToString(childs[sizeM1], dst, typeConverter);
            dst.push(">");
        }

        if (type.nullable) {
            dst.push("?");
        }

        if (type.arrayDimensions) {
            dst.push(new Array(type.arrayDimensions + 1).join("[]"));
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
            typeName: type.typeName,
        };

        if (typeModifier != null) {
            typeModifier(res);
        }

        return res;
    }




    export class TypeScript {

        /** Given a string or a Type, convert either to a TypeScript type:
         * If string, assume it is a simple typeTemplate (see parseAndConvertTypeTemplate()), parse it and convert the types to TypeScript.
         * If Type, convert the types to TypeScript.
         * @param typeTemplate a Type, or string where the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         */
        static parseTypeTemplate(typeTemplate: string | CodeAst.Type, returnUnknownTypes: boolean): CodeAst.Type {
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
         */
        static parseAndConvertTypeTemplate(typeTemplate: string | CodeAst.Type, returnUnknownTypes: boolean): string {
            return (typeof typeTemplate === "string"
                ? TypeScript.parseAndConvertTypeTemplateString(typeTemplate, returnUnknownTypes)
                : typeToString(typeTemplate, (t) => TypeScript.convertSimpleType(t, returnUnknownTypes)));
        }


        /** Parse and convert a simple type template string to a TypeScript type string.
         * The format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param typeName the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
         * @param returnUnknownTypes
         */
        static parseAndConvertTypeTemplateString(typeTemplate: string, returnUnknownTypes: boolean): string {
            var typeInfo = TypeConverter.parseTypeTemplate(typeTemplate);
            var arrayCount = typeInfo.arrayDimensions;

            var tsType = TypeScript.convertSimpleType(typeInfo.typeName, returnUnknownTypes);

            return tsType + (typeInfo.nullable ? "?" : "") + (arrayCount > 0 ? new Array(arrayCount + 1).join("[]") : "");
        }


        /** Convert primitive and common builtin C# and Java types to TypeScript equivalent types
         * @param typeName the type name (i.e. 'bool' or 'String')
         * @param returnUnknownTypes
         */
        static convertSimpleType(typeName: string, returnUnknownTypes: boolean): string {
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


        /** Check if a type is a simple C#, Java, or TypeScript data type
         * @param dataType the simple data type name (i.e. 'List' or 'int')
         * @param includeBuiltInTypes
         */
        static isPrimitiveOrBuiltInType(dataType: string, includeBuiltInTypes: boolean): boolean {
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
        }


        static createTypeTemplateToStringCode(typeTemplate: string | CodeAst.Type, variableName: string): string {
            var typeInfo = typeof typeTemplate === "string" ? TypeConverter.parseTypeTemplate(typeTemplate) : typeTemplate;

            if (typeInfo.genericParameters != null && typeInfo.genericParameters.length > 0) {
                throw new Error("cannot convert a type containing generic parameters to a string, type = '" + JSON.stringify(typeInfo) + "'");
            }

            var arrayCount = typeInfo.arrayDimensions;
            var typeName = typeInfo.typeName;

            switch (typeTemplate) {
                case "bool":
                case "boolean":
                    if (arrayCount > 0) { throw new Error("converting array of " + typeName + " to string not supported"); }
                    return "(" + variableName + " ? \"true\" : \"false\")";
                case "date":
                case "DateTime":
                case "any":
                case "number":
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
                    if (arrayCount > 0) { throw new Error("converting array of " + typeName + " to strings not supported"); }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "string":
                    return variableName;
                default:
                    throw new Error("unknown type name for TypeScript code: " + typeName);
            }
        }


        /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string */
        static createTypeTemplatesToStringCode(props: StringMap<string>): string[] {
            var keys = Object.keys(props);
            return keys.map(k => TypeScript.createTypeTemplateToStringCode(props[k], k));
        }

    }

}

export = TypeConverter;