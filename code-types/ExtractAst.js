"use strict";
/** Traverse ASTs and extracting type information from method and field signatures
 * @author TeamworkGuy2
 */
var ExtractAst;
(function (ExtractAst) {
    /** Get a map of all extended/implemented class and interface type names from the specified group of class definitions.
     * Acts recursively, looking up extended types against 'allTypeDefs'. Excludes primitive types from results.
     * @param childTypes the list of 'allTypeDefs' names to extract from
     * @param allTypeDefs a map of all type definition names and CodeAst classes
     * @param typeFilter a function which filters all the extracted types, could be used to filter out primitive types
     * @param transformTypeName optional transform for the returned type name map
     * @returns a map of type usages found
    */
    function extractInheritedTypes(childTypes, allTypeDefs, typeFilter, transformTypeName) {
        var typesUsed = {};
        for (var i = 0, size = childTypes.length; i < size; i++) {
            var classDef = allTypeDefs[childTypes[i]];
            if (classDef != null) {
                extractTypesRecursive(classDef, allTypeDefs, true, false, false, typeFilter, typesUsed, transformTypeName);
            }
        }
        return typesUsed;
    }
    ExtractAst.extractInheritedTypes = extractInheritedTypes;
    /** Get a map of all type names used by the specified subset of class definitions.
     * Used type names include: 'extends' types, 'implements' types, field types, method parameter types, and method return types.
     * @param childTypes the list of 'typeDefs' names to extract field types from
     * @param allTypeDefs a map of all type definition names to their CodeAst's
     * @param includePrimitiveTypes whether to include primitive field types (number, boolean, string, etc) in the returned map
     * @param transformTypeName optional field type transformer, returns a new type string for a given type string, returns null to ignore a field type
     * @returns a map of type usages found
     */
    function extractAllTypes(childTypes, allTypeDefs, typeFilter, transformTypeName, includeInheritedTypes, includeFieldTypes, includeMethodTypes) {
        if (includeInheritedTypes === void 0) { includeInheritedTypes = true; }
        if (includeFieldTypes === void 0) { includeFieldTypes = true; }
        if (includeMethodTypes === void 0) { includeMethodTypes = true; }
        var typesUsed = {};
        // for each class
        for (var i = 0, size = childTypes.length; i < size; i++) {
            var classDef = allTypeDefs[childTypes[i]];
            if (classDef != null) {
                extractTypesRecursive(classDef, allTypeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesUsed, transformTypeName);
            }
        }
        return typesUsed;
    }
    ExtractAst.extractAllTypes = extractAllTypes;
    function extractTypesRecursive(classDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName) {
        if (classDef == null) {
            return typesDst;
        }
        var classSig = classDef.classSignature;
        // for parent class
        if (includeInheritedTypes && classSig.extendClassName != null) {
            var extendTypes = extractGenericTypes(classSig.extendClassName);
            for (var m = 0, sizeM = extendTypes.length; m < sizeM; m++) {
                var extendType = extendTypes[m];
                var typeName = transformTypeName != null ? transformTypeName(extendType) : extendType;
                var typeNotYetAdded = (typeName == null || typesDst[typeName] == null); // check whether this type has been loaded before the next if-statement loads it
                if (typeName != null && typeFilter(typeName)) {
                    var tu1 = typesDst[typeName] || (typesDst[typeName] = []);
                    tu1.push({ class: classDef, extendType: extendType });
                }
                var parentClassDef = typeDefs[extendType];
                // prevent recursive loops, once a type has been loaded once (is not null in the 'typesDst' map), we don't need to check it again
                if (parentClassDef != null && typeNotYetAdded) {
                    extractTypesRecursive(parentClassDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName);
                }
            }
        }
        // for parent interfaces
        if (includeInheritedTypes && classSig.implementClassNames != null) {
            var implementInterfaces = classSig.implementClassNames;
            for (var k = 0, sizeK = implementInterfaces.length; k < sizeK; k++) {
                var implementTypes = extractGenericTypes(implementInterfaces[k]);
                for (var m = 0, sizeM = implementTypes.length; m < sizeM; m++) {
                    var implementType = implementTypes[m];
                    var typeName = transformTypeName != null ? transformTypeName(implementType) : implementType;
                    var typeNotYetAdded = (typeName == null || typesDst[typeName] == null);
                    if (typeName != null && typeFilter(typeName)) {
                        var tu1 = typesDst[typeName] || (typesDst[typeName] = []);
                        tu1.push({ class: classDef, implementType: implementType });
                    }
                    var parentInterfaceDef = typeDefs[implementType];
                    if (parentInterfaceDef != null && typeNotYetAdded) {
                        extractTypesRecursive(parentInterfaceDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName);
                    }
                }
            }
        }
        // for each field
        if (includeFieldTypes && classDef.fields != null) {
            var fields = classDef.fields;
            for (var k = 0, sizeK = fields.length; k < sizeK; k++) {
                var field = fields[k];
                // extract generic types
                var fieldTypes = extractGenericTypes(field.type);
                for (var m = 0, sizeM = fieldTypes.length; m < sizeM; m++) {
                    var typeName = transformTypeName != null ? transformTypeName(fieldTypes[m]) : fieldTypes[m];
                    var typeNotYetAdded = (typeName == null || typesDst[typeName] == null);
                    if (typeName != null && typeFilter(typeName)) {
                        var tu1 = typesDst[typeName] || (typesDst[typeName] = []);
                        tu1.push({ class: classDef, field: field });
                    }
                    var fieldTypeDef = typeDefs[fieldTypes[m]];
                    if (fieldTypeDef != null && typeNotYetAdded) {
                        extractTypesRecursive(fieldTypeDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName);
                    }
                }
            }
        }
        // for each method (return type and parameters)
        if (includeMethodTypes && classDef.methods != null) {
            var methods = classDef.methods;
            for (var k = 0, sizeK = methods.length; k < sizeK; k++) {
                var method = methods[k];
                // extract return type(s)
                var returnTypes = extractGenericTypes(method.returnType);
                for (var m = 0, sizeM = returnTypes.length; m < sizeM; m++) {
                    var typeName = transformTypeName != null ? transformTypeName(returnTypes[m]) : returnTypes[m];
                    var typeNotYetAdded = (typeName == null || typesDst[typeName] == null);
                    if (typeName != null && typeFilter(typeName)) {
                        var tu1 = typesDst[typeName] || (typesDst[typeName] = []);
                        tu1.push({ class: classDef, method: method, returnType: method.returnType });
                    }
                    var returnTypeDef = typeDefs[returnTypes[m]];
                    if (returnTypeDef != null && typeNotYetAdded) {
                        extractTypesRecursive(returnTypeDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName);
                    }
                }
                // extract parameters' type(s)
                var parameters = method.parameters;
                for (var n = 0, sizeN = parameters.length; n < sizeN; n++) {
                    var parameter = parameters[n];
                    var parameterTypes = extractGenericTypes(parameter.type);
                    for (var m = 0, sizeM = parameterTypes.length; m < sizeM; m++) {
                        var typeName = transformTypeName != null ? transformTypeName(parameterTypes[m]) : parameterTypes[m];
                        var typeNotYetAdded = (typeName == null || typesDst[typeName] == null);
                        if (typeName != null && typeFilter(typeName)) {
                            var tu1 = typesDst[typeName] || (typesDst[typeName] = []);
                            tu1.push({ class: classDef, method: method, parameter: parameter });
                        }
                        var parameterTypeDef = typeDefs[parameterTypes[m]];
                        if (parameterTypeDef != null && typeNotYetAdded) {
                            extractTypesRecursive(parameterTypeDef, typeDefs, includeInheritedTypes, includeFieldTypes, includeMethodTypes, typeFilter, typesDst, transformTypeName);
                        }
                    }
                }
            }
        }
        return typesDst;
    }
    /** Get a map of the types extracted from annotation arguments from the specified subset of class definitions
     * @param childTypes the list of 'typeDefs' names to extract annotation argument types from
     * @param typeDefs a map of all type definition names to their CodeAst's
     * @param typeFilter filter for all extracted annotation arguments, for example could filter out primitive field types (number, boolean, string, etc) in the returned map
     * @param extractAnnotationArgument the annotation argument type extractor, returns a string if the annotation argument is successfully mapped to a type, returns null to ignore an annotation argument
     * @returns a map of types found
     */
    function extractAnnotationArgumentTypes(childTypes, typeDefs, typeFilter, transformAnnotationArgument) {
        var typesUsed = {};
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
                        if (argType != null && typeFilter(argType)) {
                            var tu = typesUsed[argType] = typesUsed[argType] || [];
                            tu.push({ class: classDef, annotation: annotation });
                        }
                    }
                }
            }
        }
        return typesUsed;
    }
    ExtractAst.extractAnnotationArgumentTypes = extractAnnotationArgumentTypes;
    /** Recursively traverse a generic type and extract a list of all type names
     * @param type the data type to extract generic types from
     * @param dst optional, array in which to store extracted generic types
     * @returns the 'dst' parameter or a new array (if 'dst' was not provided) containing the extracted generic types
     */
    function extractGenericTypes(type, dst) {
        if (dst === void 0) { dst = []; }
        dst.push(type.typeName);
        if (type.genericParameters != null) {
            for (var i = 0, size = type.genericParameters.length; i < size; i++) {
                extractGenericTypes(type.genericParameters[i], dst);
            }
        }
        return dst;
    }
    ExtractAst.extractGenericTypes = extractGenericTypes;
    /** Given a list of CodeAst parameters and a list/map of parameter names, return maps of parameter names and types that exist and do not exist in the 'paramNames' map
     * @param params the list of parameters to process
     * @param paramNames the map of parameter names to check
     * @returns an object containing 'params' and 'unclaimedParams' properties which are each an array of properties
     */
    function claimParams(params, paramNames) {
        var types = [];
        var unknownTypes = [];
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
    ExtractAst.claimParams = claimParams;
})(ExtractAst || (ExtractAst = {}));
module.exports = ExtractAst;
