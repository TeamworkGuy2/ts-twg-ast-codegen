
/**
 * @since 2016-3-20
 */
module TsObjectGen {

    /** create code to convert an object's values from one format into another
     */
    export function createConvertObjectCode(objVarName: string, objDef: StringMap<TypeTemplate>,
            dataConverter: (typeTemplate: string | CodeAst.Type, varName: string) => string, propNameConverter: (name: string) => string,
            prettyPrint: boolean = false, initialIndentation: string = "", blockIndentation: string = "\t", indentFirstLine: boolean = false, dstLines?: string[]): string[] {

        var keys = Object.keys(objDef);
        // keep single property object declarations on one line
        if (keys.length === 1) {
            prettyPrint = false;
        }

        var propLines = keys.map(k => (prettyPrint ? initialIndentation + blockIndentation : " ") +
            propNameConverter(k) + ": " + dataConverter(objDef[k].type, objVarName + "." + k) + ",");

        var objStartStr = (indentFirstLine ? initialIndentation : "") + "{";
        var objEndStr = (prettyPrint ? initialIndentation + "}" : " }");

        // append multiple lines or one long line to both the 'lines' and 'dstLines' arrays based on 'prettyPrint' flag
        var lines: string[] = [];
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

}

export = TsObjectGen;