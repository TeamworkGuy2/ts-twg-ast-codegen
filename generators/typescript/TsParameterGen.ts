import TypeConverter = require("../../code-types/TypeConverter");

/**
 * @since 2016-3-20
 */
module TsParameterGen {

    /** create a parameter type signature from a property name and {@link TypeInfo}.
     * For example, this could generate a string like {@code "userId: string"} or {@code "isActive?: boolean"}
     */
    export function createParameterCode(name: string, prop: TypeInfo, returnUnknownTypes: boolean = true): string {
        return name + (prop.required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseCsOrJavaType(prop.type, returnUnknownTypes);
    }


    /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string
     */
    export function createParametersCode(props: StringMap<TypeInfo>, returnUnknownTypes: boolean = true): string[] {
        var keys = Object.keys(props);
        return keys.map(k => k + (props[k].required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseCsOrJavaType(props[k].type, returnUnknownTypes));
    }

}

export = TsParameterGen;