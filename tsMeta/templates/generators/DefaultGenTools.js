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
    DefaultGenTools.prototype.addIndent = function (lines) {
        if (lines == null) {
            return [];
        }
        var indent = this._printer.getIndent();
        for (var i = 0, size = lines.length; i < size; i++) {
            lines[i] = indent + lines[i];
        }
        return lines;
    };
    DefaultGenTools.prototype.getIndent = function () {
        return this._printer.getIndent();
    };
    DefaultGenTools.prototype.indent = function (levels) {
        this._printer.indent(levels);
    };
    DefaultGenTools.prototype.deindent = function (levels) {
        this._printer.deindent(levels);
    };
    return DefaultGenTools;
})();
module.exports = DefaultGenTools;
