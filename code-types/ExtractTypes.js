"use strict";
var TypeConverter = require("./TypeConverter");
/** ExtractTypes - functions for traversing code file ASTs and extracting type information from method and field signatures
 * @author TeamworkGuy2
 */
var ExtractTypes;
(function (ExtractTypes) {
    /** Get a map of all none primitive (number, boolean, etc.) extended/implemented class and interface type names from the specified group of class definitions
     * @param childTypes
     * @param availableTypeDefs
     */
    function extractInheritedTypeNames(childTypes, availableTypeDefs, transformTypeName) {
        var typesUsed = {};
        // TODO doesn't recursively extract parents beyond the first inheritance level
        for (var p = 0, sizeP = childTypes.length; p < sizeP; p++) {
            var classDef = availableTypeDefs[childTypes[p]];
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
    ExtractTypes.extractInheritedTypeNames = extractInheritedTypeNames;
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
                            var isPrimitive = TypeConverter.TypeScript.isPrimitiveOrBuiltInType(typeName, true);
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
    ExtractTypes.extractFieldTypeNames = extractFieldTypeNames;
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
    ExtractTypes.extractGenericTypes = extractGenericTypes;
})(ExtractTypes || (ExtractTypes = {}));
module.exports = ExtractTypes;
