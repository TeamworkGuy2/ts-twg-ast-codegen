"use strict";
/**
 * @since 2015-8-9
 */
var DefaultGenTools = (function () {
    function DefaultGenTools() {
    }
    Object.defineProperty(DefaultGenTools.prototype, "printer", {
        get: function () {
            return this._printer;
        },
        enumerable: true,
        configurable: true
    });
    DefaultGenTools.newInst = function (printer) {
        var genTools = new DefaultGenTools();
        genTools._printer = printer;
        return genTools;
    };
    DefaultGenTools.prototype.indent = function (lines, dst) {
        if (dst === void 0) { dst = []; }
        if (lines == null) {
            return dst;
        }
        var indent = this._printer.getIndent();
        for (var i = 0, size = lines.length; i < size; i++) {
            dst[i] = indent + lines[i];
        }
        return dst;
    };
    DefaultGenTools.prototype.indentNonEmpty = function (strs, dst) {
        if (dst === void 0) { dst = []; }
        var indent = this._printer.getIndent();
        for (var i = 0, size = strs.length; i < size; i++) {
            var str = strs[i];
            if (str && str.length > 0) {
                dst.push(indent + str);
            }
        }
        return dst;
    };
    DefaultGenTools.prototype.addIndent = function (dst, str) {
        dst.push(this._printer.getIndent() + str);
        return dst;
    };
    DefaultGenTools.prototype.addIndentsToNonEmpty = function (dst, strs) {
        return this.indentNonEmpty(strs, dst);
    };
    return DefaultGenTools;
})();
module.exports = DefaultGenTools;
