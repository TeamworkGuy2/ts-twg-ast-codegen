"use strict";
/**
 * @author TeamworkGuy2
 * @since 2015-8-9
 */
var DefaultPrettyPrinter = /** @class */ (function () {
    function DefaultPrettyPrinter(defaultIndent, currentLevel, currentIndent) {
        this.defaultIndent = defaultIndent;
        this.currentLevel = currentLevel;
        this.currentIndent = currentIndent;
    }
    DefaultPrettyPrinter.prototype.getIndent = function () {
        return this.currentIndent;
    };
    DefaultPrettyPrinter.prototype.indent = function (levels) {
        if (levels === void 0) { levels = 1; }
        var indentStr = this.currentIndent + (levels === 1 ? this.defaultIndent : this.defaultIndent.repeat(levels));
        this.currentIndent = indentStr;
        this.currentLevel += levels;
    };
    DefaultPrettyPrinter.prototype.dedent = function (levels) {
        if (levels === void 0) { levels = 1; }
        if (this.currentLevel - levels < 0) {
            throw new Error("cannot reduce indentation by " + levels + ", current level is " + this.currentLevel);
        }
        var indentStr = this.currentIndent.substr(0, (this.currentLevel - levels) * this.defaultIndent.length);
        this.currentIndent = indentStr;
        this.currentLevel -= levels;
    };
    DefaultPrettyPrinter.newInst = function (indent, startLevel) {
        if (startLevel === void 0) { startLevel = 0; }
        var indentStr = indent.repeat(startLevel);
        var pp = new DefaultPrettyPrinter(indent, startLevel, indentStr);
        return pp;
    };
    return DefaultPrettyPrinter;
}());
module.exports = DefaultPrettyPrinter;
