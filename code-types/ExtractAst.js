"use strict";
var TypeConverter = require("./TypeConverter");
/** Traverse ASTs and extracting type information from method and field signatures
 * @author TeamworkGuy2
 */
var ExtractAst;
(function (ExtractAst) {
    /** Get a map of all none primitive (number, boolean, etc.) extended/implemented class and interface type names from the specified group of class definitions
     * @param childTypes the list of 'allTypeDefs' names to extract from
     * @param allTypeDefs a map of all type definition names and CodeAst classes
     * @param transformTypeName an optional transformer for the returned type name map
     * @return a map of type names used
     */
    function extractInheritedTypeNames(childTypes, allTypeDefs, transformTypeName) {
        var typesUsed = {};
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
                            typesUsed[t1] = true;
                        }
                    }
                }
                if (classSig.implementClassNames != null) {
                    for (var j = 0, sizeJ = classSig.implementClassNames.length; j < sizeJ; j++) {
                        var implementTypes = extractGenericTypes(classSig.implementClassNames[j]);
                        for (var p = 0, sizeP = implementTypes.length; p < sizeP; p++) {
                            var t2 = transformTypeName != null ? transformTypeName(implementTypes[p]) : implementTypes[p];
                            if (t2 != null) {
                                typesUsed[t2] = true;
                            }
                        }
                    }
                }
            }
        }
        return typesUsed;
    }
    ExtractAst.extractInheritedTypeNames = extractInheritedTypeNames;
    /** Get a map of all none primitive (number, boolean, etc.) field type names from the specified group of class definitions
     * @param childTypes
     * @param typeDefs
     * @param includePrimitiveTypes
     */
    function extractFieldTypeNames(childTypes, typeDefs, includePrimitiveTypes, transformTypeName) {
        var typesUsed = {};
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
                                typesUsed[typeName] = true;
                            }
                        }
                    }
                }
            }
        }
        return typesUsed;
    }
    ExtractAst.extractFieldTypeNames = extractFieldTypeNames;
    /** Recursively traverse a generic type and extract a list of all type names
     * @param type
     * @param dst
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
     */
    function claimParams(params, paramNames) {
        var types = {};
        var unknownTypes = {};
        if (Array.isArray(paramNames)) {
            for (var i = 0, size = params.length; i < size; i++) {
                var param = params[i];
                var name = param.name;
                var idx;
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
    ExtractAst.claimParams = claimParams;
})(ExtractAst || (ExtractAst = {}));
module.exports = ExtractAst;
