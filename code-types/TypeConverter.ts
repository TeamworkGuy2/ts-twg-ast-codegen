"use strict";

/** TypeConverter - functions for converting source code data types between different languages
 * @author TeamworkGuy2
 */
module TypeConverter {

    export class TypeScript {

        // true if the type is optional, false if not
        static parseType(dataType: string): { dataType: string; required: boolean; arrayDimensionCount: number } {
            var optionalInfo = TypeScript.parseTypeOptionality(dataType);
            var dimensionInfo = TypeScript.parseTypeArrayDimensions(optionalInfo.dataType);
            return {
                arrayDimensionCount: dimensionInfo.dimensionCount,
                dataType: dimensionInfo.dataType,
                required: optionalInfo.required
            };
        }

        static parseTypeOptionality(dataType: string): { dataType: string; required: boolean } {
            var hasOptionalMark = dataType.charAt(dataType.length - 1) === "?";
            return {
                dataType: hasOptionalMark ? dataType.substr(0, dataType.length - 1) : dataType,
                required: !hasOptionalMark,
            };
        }


        static parseTypeArrayDimensions(dataType: string): { dataType: string; dimensionCount: number } {
            var arrayCount = 0;
            var idx = -1;
            while ((idx = dataType.lastIndexOf("[]")) > -1 && idx === dataType.length - 2) {
                arrayCount++;
                dataType = dataType.substring(0, idx);
            }
            return {
                dataType: dataType,
                dimensionCount: arrayCount,
            };
        }


        static parseCsOrJavaType(dataType: string, returnUnknownTypes: boolean): string {
            var optionalInfo = TypeScript.parseType(dataType);
            var arrayCount = optionalInfo.arrayDimensionCount;
            dataType = optionalInfo.dataType;

            var tsType: string = null;

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
        }


        static createTypeToStringCode(dataType: string, variableName: string): string {
            var optionalInfo = TypeScript.parseType(dataType);
            var arrayCount = optionalInfo.arrayDimensionCount;
            dataType = optionalInfo.dataType;

            switch (dataType) {
                case "bool":
                case "boolean":
                    if (arrayCount > 0) { throw new Error("converting array of " + dataType + " to string not supported"); }
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
                    if (arrayCount > 0) { throw new Error("converting array of " + dataType + " to strings not supported"); }
                    return "(" + variableName + " ? " + variableName + ".toString() : \"null\")";
                case "string":
                    return variableName;
                default:
                    throw new Error("unknown type name for TypeScript code: " + dataType);
            }
        }


        /** create code to convert an object's values from one format into another
         */
        static createConvertObjectCode(objVarName: string, objDef: StringMap<TypeInfo>,
            dataConverter: (dataType: string, varName: string) => string, propNameConverter: (name: string) => string,
            prettyPrint: boolean = false, initialIndentation: string = "", blockIndentation: string = "\t", indentFirstLine: boolean = false, dstLines?: string[]): string[] {

            var keys = Object.keys(objDef);
            // keep single property object declarations on one line
            if (keys.length === 1) {
                prettyPrint = false;
            }

            var propLines = keys.map(k => {
                return (prettyPrint ? (initialIndentation) + (blockIndentation) : " ") +
                    propNameConverter(k) + ": " + dataConverter(objDef[k].type, objVarName + "." + k) + ",";
            });
            var objStartStr = (indentFirstLine ? (initialIndentation) : "") + "{";
            var objEndStr = (prettyPrint ? (initialIndentation) + "}" : " }");

            // append multiple lines or one long line to both the 'lines' and 'dstLines' arrays based on {@code prettyPrint} flag
            var lines: string[] = [];
            if (prettyPrint) {
                if (dstLines != null) {
                    if (dstLines.length > 0) {
                        dstLines[dstLines.length - 1] = dstLines[dstLines.length - 1] + objStartStr;
                    }
                    else {
                        dstLines.push(objStartStr);
                    }
                    Array.prototype.push.apply(dstLines, propLines);
                    dstLines.push(objEndStr);
                }
                lines.push(objStartStr);
                Array.prototype.push.apply(lines, propLines);
                lines.push(objEndStr);
            }
            else {
                if (dstLines != null) {
                    if (dstLines.length > 0) {
                        dstLines[dstLines.length - 1] = dstLines[dstLines.length - 1] + objStartStr + propLines.join("") + objEndStr;
                    }
                    else {
                        dstLines.push(objStartStr + propLines.join("") + objEndStr);
                    }
                }
                lines.push(objStartStr + propLines.join("") + objEndStr);
            }
            return lines;
        }


        /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string */
        static createTypesToStringCode(props: StringMap<TypeInfo>): string[] {
            var keys = Object.keys(props);
            return keys.map(k => TypeScript.createTypeToStringCode(props[k].type, k));
        }


        /** create a parameter type signature from a property name and {@link TypeInfo}.
         * For example, this could generate a string like {@code "userId: string"} or {@code "isActive?: boolean"}
         */
        static createParameterCode(name: string, prop: TypeInfo, returnUnknownTypes: boolean = true): string {
            return name + (prop.required === false ? "?" : "") + ": " + TypeScript.parseCsOrJavaType(prop.type, returnUnknownTypes);
        }


        /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string
         */
        static createParametersCode(props: StringMap<TypeInfo>, returnUnknownTypes: boolean = true): string[] {
            var keys = Object.keys(props);
            return keys.map(k => k + (props[k].required === false ? "?" : "") + ": " + TypeScript.parseCsOrJavaType(props[k].type, returnUnknownTypes));
        }

    }

}

export = TypeConverter;