"use strict";
/** A very simple template compiler for simple tasks like function signature and data type templating/generating.
 * Template resolution has two stages, variables can be mapped to literal values or other variables using the 'variables' string map passed to the constructor.
 * Or context properties can be mapped to variables using the 'contextPropToVariableLinks' map and then values can be supplied dynamically to '.render(...)'.
 * See below example, variables are always resolved against the 'variables' map first.
 * WARNING: context values passed to '.render(...)' are inserted into the template as literals, if a context value is a string equal
 * to a 'variables' key, you could end up with an infinite resolution loop causing a stack overflow!
 *
 * For example:
 * var t = new SimpleTemplateCompiler("$", "$", { "userName": "$id$", "$userStatus$": "$status$" }, { "$displayText$": "$helloMsg$, $id$ - $userStatus$", "$helloMsg$": "Welcome", "$userStatus$": "$status$" });
 * t.render("1. $displayText$", { userName: "Bill Mill", "$userStatus$": "Stand back, I'm doing code!" });
 * t.render("2. $displayText$", { userName: "Jill Will", "$userStatus$": null });
 * Result:
 * "1. Welcome, Bill Mill - Stand back, I'm doing code!"
 * "2. Welcome, Jill Will - null"
 * @author TeamworkGuy2
 */
var SimpleTemplateCompiler = (function () {
    /** Create a template definition, ready to parse a template source string
     * @param delimiterStart: the text that identifies the start of a template variable
     * @param delimiterStop: the text that identifies the end of a template variable (may be the same as 'delimiterStart')
     * @param dataNameToExpression: associates template data property names with expression names
     * @param expressions: associates template expression names with their expansions (which are arbitrary expressions, possibly containing further expression names)
     */
    function SimpleTemplateCompiler(delimiterStart, delimiterStop, dataNameToExpression, expressions) {
        this.delimiterStart = delimiterStart;
        this.delimiterStop = delimiterStop;
        this.expressions = expressions;
        this.dataNameToExpression = dataNameToExpression;
        this.expressionToDataName = {};
        var keys = Object.keys(dataNameToExpression);
        for (var i = 0, size = keys.length; i < size; i++) {
            var key = keys[i];
            this.expressionToDataName[dataNameToExpression[key]] = key;
        }
    }
    /** Recursively replace template variable names in a string with their values.
     * Recursive variable resolution continues until no 'delimiterStart' sequences remain in the rendered 'src'.
     * NOTE: if a variable's expansion contains itself or a cyclic reference, a stack overflow will occur
     * @param src: the template string to render
     * @param templateData: associates template context property names with values
     * @return 'src' with template variable names replaced with 'variables' passed to the constructor and values from 'values'
     */
    SimpleTemplateCompiler.prototype.render = function (src, templateData) {
        var res = "";
        var startSym = this.delimiterStart;
        var endSym = this.delimiterStop;
        var remaining = src;
        var startI = -1;
        var endI = -1;
        while (remaining.length > 0 && (startI = remaining.indexOf(startSym)) > -1) {
            var remainingAfterStartSym = remaining.substring(startI + startSym.length);
            endI = remainingAfterStartSym.indexOf(endSym) + (startI + startSym.length);
            if (endI === -1) {
                endI = remaining.length - endSym.length;
            }
            var tmpl = remaining.substring(startI, endI + endSym.length);
            var dataVarName = null;
            var tmplResolved = null;
            // variables are resolved against context and if no matching context name-value exists, the 'variables' value is used
            if (!!(dataVarName = this.expressions[tmpl])) {
                tmplResolved = templateData[dataVarName];
                if (tmplResolved === undefined) {
                    tmplResolved = dataVarName;
                }
            }
            else if (!!(dataVarName = this.expressionToDataName[tmpl])) {
                tmplResolved = templateData[dataVarName];
            }
            res += remaining.substring(0, startI) + tmplResolved;
            remaining = remaining.substring(endI + endSym.length);
        }
        if (remaining.length > 0) {
            res += remaining;
        }
        return res.indexOf(startSym) > -1 ? this.render(res, templateData) : res;
    };
    SimpleTemplateCompiler.fromSimpleTemplate = function (simpleTemplate) {
        var inst = new SimpleTemplateCompiler(simpleTemplate.delimiterStart, simpleTemplate.delimiterStop, simpleTemplate.templateData, simpleTemplate.templateExpressions);
        return inst;
    };
    return SimpleTemplateCompiler;
}());
module.exports = SimpleTemplateCompiler;
