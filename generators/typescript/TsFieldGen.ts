import TypeConverter = require("../../code-types/TypeConverter");

/** Generators for TypeScript field declarations
 * @since 2016-3-20
 */
module FieldGen {

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
    export function createFieldsSrcCode(fields: CodeAst.Field[], context: CodeContext, converters: {
            getAccessModifierStr?: (fieldName: string, field: CodeAst.Field) => string;
            preFieldToStr?: (fieldName: string, fieldType: CodeAst.GenericType) => CodeAst.GenericType;
            fieldToStr?: (fieldName: string, fieldType: CodeAst.GenericType, typeConverter: (dataType: string) => string) => string;
            postFieldToStr?: (fieldName: string, typeStr: string) => string;
            preTypeConverter?: (dataType: string) => string;
            typeConverter?: (dataType: string) => string;
            postTypeConverter?: (dataType: string) => string;
    }): string[] {
        // default access modifier joins access modifiers with spaces
        if (converters.getAccessModifierStr == null) {
            converters.getAccessModifierStr = (name, field) => field.accessModifiers.join(" ") + " ";
        }
        // default type converter maps Java and C# primitive types (and some common built in types) to typescript types
        if (converters.typeConverter == null) {
            converters.typeConverter = (type) => TypeConverter.TypeScript.parseCsOrJavaType(type, false);
        }
        // default to-string function recursively builds a generic type (i.e. 'Map<String, List<int[]>')
        if (converters.fieldToStr == null) {
            converters.fieldToStr = (name, type, typeConverter) => TypeConverter.TypeScript.typeToString(type, typeConverter);
        }

        var typeConverter = (converters.preTypeConverter || converters.postTypeConverter) ? (type) => {
            type = converters.preTypeConverter != null ? converters.preTypeConverter(type) : type;
            type = converters.typeConverter(type);
            type = converters.postTypeConverter != null ? converters.postTypeConverter(type) : type;
            return type;
        } : converters.typeConverter;

        var res: string[] = [];

        for (var i = 0, size = fields.length; i < size; i++) {
            var field = fields[i];
            var fieldName = field.name;
            var type = converters.preFieldToStr != null ? converters.preFieldToStr(fieldName, field.type) : field.type;
            var fieldType = converters.fieldToStr(fieldName, type, typeConverter);
            fieldType = converters.postFieldToStr != null ? converters.postFieldToStr(fieldName, fieldType) : fieldType;
            res.push(converters.getAccessModifierStr(fieldName, field) + fieldName + ": " + fieldType + ";");
        }
        return res;
    }

}

export = FieldGen;