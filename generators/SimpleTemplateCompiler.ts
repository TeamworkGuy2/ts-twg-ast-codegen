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
class SimpleTemplateCompiler<T extends { [id: string]: any }> {
    private variableStartDelimiter: string;
    private variableEndDelimiter: string;
    private variables: { [id: string]: string };
    private contextPropToVariableNameLinks: { [id: string]: string };
    private variableToContextPropNameLinks: { [id: string]: string };


    /** Create a template definition, ready to parse a template
     * @param contextPropToVariableLinks: associates context data property names with 'variables' names
     * @param variables: a string-to-string mapping of template variables to their definitions
     * @param startDelimiter: the text that identifies the start of a template variable
     * @param endDelimiter: the text that identifies the end of a template variable (may be the same as 'startDelimiter')
     */
    constructor(startDelimiter: string, stopDelimiter: string, contextPropToVariableLinks: T, variables: { [id: string]: string }) {
        this.variableStartDelimiter = startDelimiter;
        this.variableEndDelimiter = stopDelimiter;
        this.variables = variables;
        this.contextPropToVariableNameLinks = contextPropToVariableLinks;
        this.variableToContextPropNameLinks = {};

        var linkNames = Object.keys(contextPropToVariableLinks);
        for (var i = 0, size = linkNames.length; i < size; i++) {
            var key = linkNames[i];
            this.variableToContextPropNameLinks[contextPropToVariableLinks[key]] = key;
        }
    }


    /** Recursively replace template variables in a string with values.
     * Recursive variable resolution continues until no 'startDelimiter' sequences remain in the rendered 'stringTemplate'
     * @param stringTemplate: the template string to render
     * @param contextValues: associates template context property names with values
     * @return 'stringTemplate' with template variable names replaced with 'variables' passed to the constructor and values from 'values'
     */
    render(stringTemplate: string, contextValues: T): string {
        var res = "";
        var startSym = this.variableStartDelimiter;
        var endSym = this.variableEndDelimiter;
        var remaining = stringTemplate;
        var startI = -1;
        var endI = -1;

        while (remaining.length > 0 && (startI = remaining.indexOf(startSym)) > -1) {
            var remainingAfterStartSym = remaining.substring(startI + startSym.length);
            endI = remainingAfterStartSym.indexOf(endSym) + (startI + startSym.length);
            if (endI === -1) {
                endI = remaining.length - endSym.length;
            }

            var tmpl = remaining.substring(startI, endI + endSym.length);

            var tmplVar: string = null;
            var tmplResolved: string = null;
            // variables are resolved against context and if no matching context name-value exists, the 'variables' value is used
            if (!!(tmplVar = this.variables[tmpl])) {
                tmplResolved = contextValues[tmplVar];
                if (tmplResolved === undefined) {
                    tmplResolved = tmplVar;
                }
            }
            // context props are resolved against context only
            else if (!!(tmplVar = this.variableToContextPropNameLinks[tmpl])) {
                tmplResolved = contextValues[tmplVar];
            }

            res += remaining.substring(0, startI) + tmplResolved;

            remaining = remaining.substring(endI + endSym.length);
        }
        if (remaining.length > 0) {
            res += remaining;
        }
        return res.indexOf(startSym) > -1 ? this.render(res, contextValues) : res;
    }
}

export = SimpleTemplateCompiler;