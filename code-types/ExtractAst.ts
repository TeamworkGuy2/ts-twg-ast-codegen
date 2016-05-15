"use strict";
import TypeConverter = require("./TypeConverter");

/** ExtractAst - functions for traversing code file ASTs and extracting type information from method and field signatures
 * @author TeamworkGuy2
 */
module ExtractAst {

    /** Get a map of all none primitive (number, boolean, etc.) extended/implemented class and interface type names from the specified group of class definitions
     * @param childTypes the list of 'allTypeDefs' names to extract from
     * @param allTypeDefs a map of all type definition names and CodeAst classes
     * @param transformTypeName an optional transformer for the returned type name map
     * @return a map of type names used
     */
    export function extractInheritedTypeNames(childTypes: string[], allTypeDefs: StringMap<CodeAst.Class>, transformTypeName?: (type: string) => string): StringMap<boolean> {
        var typesUsed: StringMap<boolean> = {};

        // TODO doesn't recursively extract parents beyond the first inheritance level
        for (var p = 0, sizeP = childTypes.length; p < sizeP; p++) {
            var classDef = allTypeDefs[childTypes[p]];
            if (classDef != null && classDef.classSignature.extendClassName) {
                var extendTypes = extractGenericTypes(classDef.classSignature.extendClassName);

                for (var k = 0, sizeK = extendTypes.length; k < sizeK; k++) {
                    var t1 = transformTypeName ? transformTypeName(extendTypes[k]) : extendTypes[k];
                    if (t1 != null) {
                        typesUsed[t1] = true;
                    }
                }
            }
            if (classDef != null && classDef.classSignature.implementClassNames) {
                for (var j = 0, sizeJ = classDef.classSignature.implementClassNames.length; j < sizeJ; j++) {
                    var implementTypes = extractGenericTypes(classDef.classSignature.implementClassNames[j]);

                    for (var k = 0, sizeK = implementTypes.length; k < sizeK; k++) {
                        var t2 = transformTypeName ? transformTypeName(implementTypes[k]) : implementTypes[k];
                        if (t2 != null) {
                            typesUsed[t2] = true;
                        }
                    }
                }
            }
        }
        return typesUsed;
    }


    /** Get a map of all none primitive (number, boolean, etc.) field type names from the specified group of class definitions
     * @param childTypes
     * @param availableTypeDefs
     * @param includePrimitiveTypes
     */
    export function extractFieldTypeNames(childTypes: string[], availableTypeDefs: StringMap<CodeAst.Class>, includePrimitiveTypes: boolean, transformTypeName?: (type: string) => string): StringMap<boolean> {
        var typesUsed: StringMap<boolean> = {};

        // TODO doesn't recursively extract generic beyond the fields' own generic types
        for (var p = 0, sizeP = childTypes.length; p < sizeP; p++) {
            var classDef = availableTypeDefs[childTypes[p]];
            if (classDef != null && classDef.fields) {
                var fields = classDef.fields;
                for (var k = 0, sizeK = fields.length; k < sizeK; k++) {
                    // extract generic types
                    var fieldTypes = extractGenericTypes(fields[k].type);
                    for (var m = 0, sizeM = fieldTypes.length; m < sizeM; m++) {
                        var typeName = transformTypeName ? transformTypeName(fieldTypes[m]) : fieldTypes[m]; // returns null for types not starting with upper-case letter (which automatically excludes most primitives)
                        if (typeName) {
                            var isPrimitive = TypeConverter.isPrimitive(typeName) || TypeConverter.isCore(typeName);
                            if (includePrimitiveTypes || !isPrimitive) {
                                typesUsed[typeName] = true;
                            }
                        }
                    }
                }
            }
        }

        return typesUsed;
    }


    /** Recursively traverse a generic type and extract a list of all type names
     * @param type
     * @param dst
     */
    export function extractGenericTypes(type: CodeAst.Type, dst: string[] = []): string[] {
        dst.push(type.typeName);

        if (type.genericParameters) {
            for (var i = 0, size = type.genericParameters.length; i < size; i++) {
                extractGenericTypes(type.genericParameters[i], dst);
            }
        }
        return dst;
    }


    /** Given a list of CodeAst parameters and a list/map of parameter names, return maps of parameter names and types that exist and do not exist in the 'paramNames' map
     * @param params the list of parameters to process
     * @param paramNames the map of parameter names to check
     */
    export function claimParams(params: CodeAst.MethodParameter[], paramNames: StringMap<any> | string[]): { params: StringMap<CodeAst.Type>; unclaimedParams: StringMap<CodeAst.Type>; } {
        var types: StringMap<CodeAst.Type> = {};
        var unknownTypes: StringMap<CodeAst.Type> = {};

        if (Array.isArray(paramNames)) {
            for (var i = 0, size = params.length; i < size; i++) {
                var param = params[i];
                var name = param.name;

                var idx: number;
                if ((idx = paramNames.indexOf(name)) > -1) {
                    types[paramNames[idx]] = param.type;
                }
                else {
                    unknownTypes[name] = param.type;
                }
            }
        }
        else {
            for (var i = 0, size = params.length; i < size; i++) {
                var param = params[i];
                var name = param.name;

                if (paramNames[name]) {
                    types[paramNames[name]] = param.type;
                }
                else {
                    unknownTypes[name] = param.type;
                }
            }
        }

        return {
            params: types,
            unclaimedParams: unknownTypes,
        };
    }


    /** Find an annotation containing a given property
     * @param annotations the array of annotations to process
     * @param getProp the property accessor used to check
     * @param minCount the minimum number of expected matching annotations (if this many matches aren't found, throw an error)
     * @param propName the optional name of the property to display in error messages
     */
    export function findOneAnnotationProp<T>(annotations: CodeAst.Annotation[], getProp: (ann: CodeAst.Annotation) => T, minCount: number = 0, propName?: string): T {
        var prop: T = null;
        var foundCount = 0;
        for (var i = 0, size = annotations.length; i < size; i++) {
            var annt = annotations[i];
            var annProp = getProp(annt);
            if (annProp) {
                if (foundCount === 0) {
                    prop = annProp;
                }
                foundCount++;
            }
        }

        if (foundCount > 1) { throw new Error("annotations contained multiple '" + propName + "' props: " + JSON.stringify(annotations)); }
        if (foundCount < minCount) { throw new Error("annotations contained no '" + propName + "' props: " + JSON.stringify(annotations)); }

        return prop;
    }

}

export = ExtractAst;
