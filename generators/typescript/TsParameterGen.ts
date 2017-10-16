import TypeConverter = require("../../code-types/TypeConverter");

/**
 * @since 2016-3-20
 */
module TsParameterGen {

    /** create a parameter type signature from a property name and TypeTemplate.
     * For example, this could generate a string like "userIds: List<string>" or "isActive?: boolean"
     */
    export function createParameterCode(name: string, prop: TypeTemplate, returnUnknownTypes: boolean = true): string {
        var type = prop.type;
        return name + (prop.required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseAndConvertTypeTemplate(type, returnUnknownTypes, true, " | null");
    }


    /** convert a map of property names and TypeInfo values into an array of code strings that convert each property to a string
     */
    export function createParametersCode(props: StringMap<TypeTemplate>, returnUnknownTypes: boolean = true): string[] {
        var keys = Object.keys(props);
        return keys.map(k => k + (props[k].required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseAndConvertTypeTemplate(props[k].type, returnUnknownTypes, true, " | null"));
    }

}

export = TsParameterGen;