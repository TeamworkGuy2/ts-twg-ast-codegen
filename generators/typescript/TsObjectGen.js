"use strict";
/** Generate source code which converts the properties of an object from a source to destination format.
 * @author TeamworkGuy2
 * @since 2016-3-20
 */
var TsObjectGen;
(function (TsObjectGen) {
    /** Generate source code that converts an object's properties from one format into another
     */
    function createConvertObjectCode(objVarName, objDef, dataConverter, propNameConverter, prettyPrint, initialIndentation, blockIndentation, indentFirstLine, dstLines) {
        if (prettyPrint === void 0) { prettyPrint = false; }
        if (initialIndentation === void 0) { initialIndentation = ""; }
        if (blockIndentation === void 0) { blockIndentation = "\t"; }
        if (indentFirstLine === void 0) { indentFirstLine = false; }
        var keys = Object.keys(objDef);
        var propLines = keys.map(function (k) { return (prettyPrint ? initialIndentation + blockIndentation : " ") +
            propNameConverter(k) + ": " + dataConverter(objDef[k].type, objVarName + "." + k) + ","; });
        var objStartStr = (indentFirstLine ? initialIndentation : "") + "{";
        var objEndStr = (prettyPrint ? initialIndentation + "}" : " }");
        // append multiple lines or one long line to both the 'lines' and 'dstLines' arrays based on 'prettyPrint' flag
        var lines = [];
        if (prettyPrint) {
            if (dstLines != null) {
                if (dstLines.length > 0) {
                    dstLines[dstLines.length - 1] = dstLines[dstLines.length - 1] + objStartStr;
                }
                else {
                    dstLines.push(objStartStr);
                }
                Array.prototype.push.apply(dstLines, propLines);
                dstLines.push(objEndStr);
            }
            lines.push(objStartStr);
            Array.prototype.push.apply(lines, propLines);
            lines.push(objEndStr);
        }
        else {
            if (dstLines != null) {
                if (dstLines.length > 0) {
                    dstLines[dstLines.length - 1] = dstLines[dstLines.length - 1] + objStartStr + propLines.join("") + objEndStr;
                }
                else {
                    dstLines.push(objStartStr + propLines.join("") + objEndStr);
                }
            }
            lines.push(objStartStr + propLines.join("") + objEndStr);
        }
        return lines;
    }
    TsObjectGen.createConvertObjectCode = createConvertObjectCode;
})(TsObjectGen || (TsObjectGen = {}));
module.exports = TsObjectGen;
