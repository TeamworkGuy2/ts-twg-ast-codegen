var TypeConverter = require("../../code-types/TypeConverter");
/**
 * @since 2016-3-20
 */
var TsParameterGen;
(function (TsParameterGen) {
    /** create a parameter type signature from a property name and {@link TypeInfo}.
     * For example, this could generate a string like {@code "userId: string"} or {@code "isActive?: boolean"}
     */
    function createParameterCode(name, prop, returnUnknownTypes) {
        if (returnUnknownTypes === void 0) { returnUnknownTypes = true; }
        return name + (prop.required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseCsOrJavaType(prop.type, returnUnknownTypes);
    }
    TsParameterGen.createParameterCode = createParameterCode;
    /** convert a map of property names and {@link TypeInfo} values into an array of code strings that convert each property to a string
     */
    function createParametersCode(props, returnUnknownTypes) {
        if (returnUnknownTypes === void 0) { returnUnknownTypes = true; }
        var keys = Object.keys(props);
        return keys.map(function (k) { return k + (props[k].required === false ? "?" : "") + ": " + TypeConverter.TypeScript.parseCsOrJavaType(props[k].type, returnUnknownTypes); });
    }
    TsParameterGen.createParametersCode = createParametersCode;
})(TsParameterGen || (TsParameterGen = {}));
module.exports = TsParameterGen;
