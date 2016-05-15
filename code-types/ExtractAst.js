"use strict";
var TypeConverter = require("./TypeConverter");
/** ExtractAst - functions for traversing code file ASTs and extracting type information from method and field signatures
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
    ExtractAst.extractInheritedTypeNames = extractInheritedTypeNames;
    /** Get a map of all none primitive (number, boolean, etc.) field type names from the specified group of class definitions
     * @param childTypes
     * @param availableTypeDefs
     * @param includePrimitiveTypes
     */
    function extractFieldTypeNames(childTypes, availableTypeDefs, includePrimitiveTypes, transformTypeName) {
        var typesUsed = {};
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
    ExtractAst.extractFieldTypeNames = extractFieldTypeNames;
    /** Recursively traverse a generic type and extract a list of all type names
     * @param type
     * @param dst
     */
    function extractGenericTypes(type, dst) {
        if (dst === void 0) { dst = []; }
        dst.push(type.typeName);
        if (type.genericParameters) {
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
    /** Find an annotation containing a given property
     * @param annotations the array of annotations to process
     * @param getProp the property accessor used to check
     * @param minCount the minimum number of expected matching annotations (if this many matches aren't found, throw an error)
     * @param propName the optional name of the property to display in error messages
     */
    function findOneAnnotationProp(annotations, getProp, minCount, propName) {
        if (minCount === void 0) { minCount = 0; }
        var prop = null;
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
        if (foundCount > 1) {
            throw new Error("annotations contained multiple '" + propName + "' props: " + JSON.stringify(annotations));
        }
        if (foundCount < minCount) {
            throw new Error("annotations contained no '" + propName + "' props: " + JSON.stringify(annotations));
        }
        return prop;
    }
    ExtractAst.findOneAnnotationProp = findOneAnnotationProp;
})(ExtractAst || (ExtractAst = {}));
module.exports = ExtractAst;
