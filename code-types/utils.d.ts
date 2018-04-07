/// <reference path="./ast-types.d.ts" />

interface GenTools {

    indent(dst: string[], lines: string | string[]): string[];

    indentNonEmpty(dst: string[], strs: string | string[]): string[];

    printer: PrettyPrinter;
}


interface PrettyPrinter {

    getIndent(): string;

    indent(levels?: number): void;

    dedent(levels?: number): void;
}


interface CodeContext {
    className: string;
    namespace: string;
}


interface TypeTemplateParser {
    (typeTemplate: string | CodeAst.Type): CodeAst.Type;
}


/** SimpleTemplate - a template configuration object with delimiter symbols, data, and expressions
 * @author TeamworkGuy2
 */
interface SimpleTemplate<L> {
    /** customize the strings that mark the start/end of a template variable */
    delimiterStart: string;
    /** customize the strings that mark the end of a template variable */
    delimiterStop: string;

    /** the key names in this map are the variables that are provided by the parent code when this template is generated.
     * the key names cannot be modified without modifying the code that uses this template file
     * the value strings can be modified to be any template variable name you want, these are used by the 'templateVariables' map
     */
    templateData: L;

    /** associates template variables (used by template-type-props) with expressions containing 'templateInputLinks' values
     * when a model template is generated, template-type-props (e.g. 'toLocal', 'toService') get expanded recursively from the keys in this map to thir values until no templateStart/End marks remain
     */
    templateExpressions: { [name: string]: string };
}
