import TypeConverter = require("./TypeConverter");

/** Traverse ASTs and extracting type information from method and field signatures
 * @author TeamworkGuy2
 */
module ExtractAst {

    /** Get a map of all none primitive (number, boolean, etc.) extended/implemented class and interface type names from the specified group of class definitions
     * @param childTypes the list of 'allTypeDefs' names to extract from
     * @param allTypeDefs a map of all type definition names and CodeAst classes
     * @param transformTypeName optional transform for the returned type name map
     * @returns a map of types found
    */
    export function extractInheritedTypeNames(childTypes: string[], allTypeDefs: StringMap<CodeAst.Class>, transformTypeName?: (type: string) => (string | null)): StringMap<(TypeUsage.ClassExtends | TypeUsage.ClassImplements)[]> {
        var typesUsed: StringMap<(TypeUsage.ClassExtends | TypeUsage.ClassImplements)[]> = {};

        // TODO doesn't recursively extract parents beyond the first inheritance level
        for (var i = 0, size = childTypes.length; i < size; i++) {
            var classDef = allTypeDefs[childTypes[i]];
            if (classDef != null) {
                var classSig = classDef.classSignature;

                if (classSig.extendClassName != null) {
                    var extendTypes = extractGenericTypes(classSig.extendClassName);

                    for (var k = 0, sizeK = extendTypes.length; k < sizeK; k++) {
                        var t1 = transformTypeName != null ? transformTypeName(extendTypes[k]) : extendTypes[k];
                        if (t1 != null) {
                            var tu1 = typesUsed[t1] || (typesUsed[t1] = []);
                            tu1.push({ class: classDef, extendType: extendTypes[k] });
                        }
                    }
                }

                if (classSig.implementClassNames != null) {
                    for (var j = 0, sizeJ = classSig.implementClassNames.length; j < sizeJ; j++) {
                        var implementTypes = extractGenericTypes(classSig.implementClassNames[j]);

                        for (var p = 0, sizeP = implementTypes.length; p < sizeP; p++) {
                            var t2 = transformTypeName != null ? transformTypeName(implementTypes[p]) : implementTypes[p];
                            if (t2 != null) {
                                var tu2 = typesUsed[t2] || (typesUsed[t2] = []);
                                tu2.push({ class: classDef, implementType: implementTypes[p] });
                            }
                        }
                    }
                }
            }
        }
        return typesUsed;
    }


    /** Get a map of the field type names from the specified subset of class definitions
     * @param childTypes the list of 'typeDefs' names to extract field types from
     * @param typeDefs a map of all type definition names to their CodeAst's
     * @param includePrimitiveTypes whether to include primitive field types (number, boolean, string, etc) in the returned map
     * @param transformTypeName optional field type transformer, returns a new type string for a given type string, returns null to ignore a field type
     * @returns a map of types found
     */
    export function extractFieldTypeNames(childTypes: string[], typeDefs: StringMap<CodeAst.Class>, includePrimitiveTypes: boolean,
        transformTypeName?: (type: string) => (string | null)
    ): StringMap<TypeUsage.Field[]> {
        var typesUsed: StringMap<TypeUsage.Field[]> = {};

        // TODO doesn't recursively extract generic beyond the fields' own generic types
        for (var p = 0, sizeP = childTypes.length; p < sizeP; p++) {
            var classDef = typeDefs[childTypes[p]];
            if (classDef != null && classDef.fields != null) {
                var fields = classDef.fields;
                for (var k = 0, sizeK = fields.length; k < sizeK; k++) {
                    // extract generic types
                    var fieldTypes = extractGenericTypes(fields[k].type);
                    for (var m = 0, sizeM = fieldTypes.length; m < sizeM; m++) {
                        var typeName = transformTypeName != null ? transformTypeName(fieldTypes[m]) : fieldTypes[m]; // returns null for types not starting with upper-case letter (which automatically excludes most primitives)
                        if (typeName != null) {
                            if (includePrimitiveTypes || (!TypeConverter.isPrimitive(typeName) && !TypeConverter.isCore(typeName))) {
                                var tu1 = typesUsed[typeName] || (typesUsed[typeName] = []);
                                tu1.push({ class: classDef, field: fields[k] });
                            }
                        }
                    }
                }
            }
        }

        return typesUsed;
    }


    /** Get a map of the types extracted from annotation arguments from the specified subset of class definitions
     * @param childTypes the list of 'typeDefs' names to extract annotation argument types from
     * @param typeDefs a map of all type definition names to their CodeAst's
     * @param includePrimitiveTypes whether to include primitive field types (number, boolean, string, etc) in the returned map
     * @param extractAnnotationArgument the annotation argument type extractor, returns a string if the annotation argument is successfully mapped to a type, returns null to ignore an annotation argument
     * @returns a map of types found
     */
    export function extractAnnotationArgumentTypes(childTypes: string[], typeDefs: StringMap<CodeAst.Class>, includePrimitiveTypes: boolean,
        transformAnnotationArgument: (annotation: CodeAst.Annotation, argumentName: string, argumentValue: string) => (string | null)
    ): StringMap<TypeUsage.Annotation[]> {
        var typesUsed: StringMap<TypeUsage.Annotation[]> = {};

        // Loop through all used types to find any missing children
        for (var i = 0, size = childTypes.length; i < size; i++) {
            var classDef = typeDefs[childTypes[i]];
            if (classDef != null && classDef.classSignature.annotations != null) {
                var annotations = classDef.classSignature.annotations;

                for (var k = 0, sizeK = annotations.length; k < sizeK; k++) {
                    var annotation = annotations[k];
                    var argNames = Object.keys(annotation.arguments);

                    for (var m = 0, sizeM = argNames.length; m < sizeM; m++) {
                        var argType = transformAnnotationArgument(annotation, argNames[m], annotation.arguments[argNames[m]]);
                        if (argType != null) {
                            if (includePrimitiveTypes || (!TypeConverter.isPrimitive(argType) && !TypeConverter.isCore(argType))) {
                                var tu = typesUsed[argType] = typesUsed[argType] || [];
                                tu.push({ class: classDef, annotation: annotation });
                            }
                        }
                    }
                }
            }
        }

        return typesUsed;
    }


    /** Recursively traverse a generic type and extract a list of all type names
     * @param type the data type to extract generic types from
     * @param dst optional, array in which to store extracted generic types
     * @returns the 'dst' parameter or a new array (if 'dst' was not provided) containing the extracted generic types
     */
    export function extractGenericTypes(type: CodeAst.Type, dst: string[] = []): string[] {
        dst.push(type.typeName);

        if (type.genericParameters != null) {
            for (var i = 0, size = type.genericParameters.length; i < size; i++) {
                extractGenericTypes(type.genericParameters[i], dst);
            }
        }
        return dst;
    }


    /** Given a list of CodeAst parameters and a list/map of parameter names, return maps of parameter names and types that exist and do not exist in the 'paramNames' map
     * @param params the list of parameters to process
     * @param paramNames the map of parameter names to check
     * @returns an object containing 'params' and 'unclaimedParams' properties which are each an array of properties
     */
    export function claimParams(params: CodeAst.MethodParameter[], paramNames: StringMap<any> | string[]): { params: CodeAst.MethodParameter[]; unclaimedParams: CodeAst.MethodParameter[]; } {
        var types: CodeAst.MethodParameter[] = [];
        var unknownTypes: CodeAst.MethodParameter[] = [];

        if (Array.isArray(paramNames)) {
            for (var i = 0, size = params.length; i < size; i++) {
                var param = params[i];

                if (paramNames.indexOf(param.name) > -1) {
                    types.push(param);
                }
                else {
                    unknownTypes.push(param);
                }
            }
        }
        else {
            for (var i = 0, size = params.length; i < size; i++) {
                var param = params[i];

                if (paramNames[param.name]) {
                    types.push(param);
                }
                else {
                    unknownTypes.push(param);
                }
            }
        }

        return {
            params: types,
            unclaimedParams: unknownTypes,
        };
    }

}

export = ExtractAst;
