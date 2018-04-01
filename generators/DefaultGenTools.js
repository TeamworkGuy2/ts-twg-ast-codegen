"use strict";
/**
 * @author TeamworkGuy2
 * @since 2015-8-9
 */
var DefaultGenTools = /** @class */ (function () {
    function DefaultGenTools() {
    }
    /** Create a GenTools implementation which uses the given PrettyPrinter for indentation
     */
    DefaultGenTools.newInst = function (printer) {
        var genTools = new DefaultGenTools();
        genTools.printer = printer;
        return genTools;
    };
    /** Indent each of the 'lines' and append them to the 'dst' array, return 'dst'
     */
    DefaultGenTools.prototype.indent = function (dst, lines) {
        if (lines == null) {
            return dst;
        }
        var indent = this.printer.getIndent();
        if (typeof lines === "string") {
            dst.push(indent + lines);
            return dst;
        }
        for (var i = 0, size = lines.length; i < size; i++) {
            dst.push(indent + lines[i]);
        }
        return dst;
    };
    /** Indent each of the none empty 'lines' and append all the lines to the 'dst' array, return 'dst'
     */
    DefaultGenTools.prototype.indentNonEmpty = function (dst, strs) {
        var indent = this.printer.getIndent();
        if (typeof strs === "string") {
            dst.push(indent + strs);
            return dst;
        }
        for (var i = 0, size = strs.length; i < size; i++) {
            var str = strs[i];
            dst.push((str && str.length > 0) ? (indent + str) : str);
        }
        return dst;
    };
    return DefaultGenTools;
}());
module.exports = DefaultGenTools;
