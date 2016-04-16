"use strict";
var TypeConverter = require("../../code-types/TypeConverter");
/** Generators for TypeScript field declarations
 * @since 2016-3-20
 */
var FieldGen;
(function (FieldGen) {
    /** Convert field ASTs to typescript field declarations (i.e. 'private myId: number;' or 'public isReal?: boolean;')
     * @param fields the fields to convert to TypeScript field declaration source code
     * @param context the class/namespace/package context of the list of fields
     * @param converters optional conversion functions for field ASTs and data types with basic default functions
     * - 'getAccessModifierStr': get the access modifier string for a field declaration (i.e. 'public', 'private'), if null, defaults to {@code field.accessModifiers.join(" ") + " "}
     * - 'fieldToStr': the main function which converts a field AST to a string, it accepts the field's name, the field's type, and type converter for individual type strings, returns a string,
     *     if null, defaults to 'TypeConverter.TypeScript.typeToString'
     * - 'preFieldToStr': pre-processor for the field AST, it accepts the field name, the field's type, returns a field type
     * - 'postFieldToStr': post-processor for the resulting field AST string, it accepts the field's name, the field's type string representation, returns a string
     * - 'typeConverter': convert a 'CodeAst.GenericType' data type string to a string, accepts a data type string, returns a string,
           if null, defaults to 'TypeConverter.TypeScript.parseCsOrJavaType'
     * - 'preTypeConverter': pre-process a 'CodeAst.GenericType' data type string to a string, accepts a data type string, returns a string
     * - 'postTypeConverter': post-process a 'CodeAst.GenericType' data type string to a string, accepts a data type string, returns a string
     */
    function createFieldsSrcCode(fields, context, converters) {
        if (converters === void 0) { converters = {}; }
        // default access modifier joins access modifiers with spaces
        if (converters.getAccessModifierStr == null) {
            converters.getAccessModifierStr = function (name, field, ctx) { return field.accessModifiers.join(" ") + " "; };
        }
        // default type converter maps Java and C# primitive types (and some common built in types) to typescript types
        if (converters.typeConverter == null) {
            converters.typeConverter = function (name, type, ctx) { return TypeConverter.TypeScript.parseCsOrJavaType(type, true); };
        }
        // default to-string function recursively builds a generic type (i.e. 'Map<String, List<int[]>')
        if (converters.fieldToStr == null) {
            converters.fieldToStr = function (name, type, typeConverter, ctx) { return TypeConverter.TypeScript.typeToString(type, function (t) { return typeConverter(name, t, ctx); }); };
        }
        var typeConverter = converters.typeConverter;
        if (converters.preTypeConverter || converters.postTypeConverter) {
            typeConverter = function (name, type, ctx) {
                type = converters.preTypeConverter != null ? converters.preTypeConverter(name, type, ctx) : type;
                type = converters.typeConverter(name, type, ctx);
                type = converters.postTypeConverter != null ? converters.postTypeConverter(name, type, ctx) : type;
                return type;
            };
        }
        var res = [];
        for (var i = 0, size = fields.length; i < size; i++) {
            var field = fields[i];
            var fieldName = field.name;
            var type = converters.preFieldToStr != null ? converters.preFieldToStr(fieldName, field.type, context) : field.type;
            var fieldType = converters.fieldToStr(fieldName, type, typeConverter, context);
            fieldType = converters.postFieldToStr != null ? converters.postFieldToStr(fieldName, fieldType, context) : fieldType;
            res.push(converters.getAccessModifierStr(fieldName, field, context) + fieldName + (type.nullable ? "?" : "") + ": " + fieldType + ";");
        }
        return res;
    }
    FieldGen.createFieldsSrcCode = createFieldsSrcCode;
    /** Create a CodeAst field with default access of 'public' from a given field name and 'TypeInfo'
     * @param name the name of the field
     * @param info the type info associated with the field
     */
    function typInfoToField(name, info) {
        var typeInfo = TypeConverter.TypeScript.parseType(info.type);
        return {
            name: name,
            type: {
                arrayDimensions: info.arrayDimensionCount > 0 ? info.arrayDimensionCount : typeInfo.arrayDimensionCount,
                nullable: info.required === false || info.required === true ? !info.required : typeInfo.required === false,
                typeName: typeInfo.type
            },
            accessModifiers: ["public"],
            comments: []
        };
    }
    FieldGen.typInfoToField = typInfoToField;
})(FieldGen || (FieldGen = {}));
module.exports = FieldGen;
