"use strict";

/**
 * @since 2015-8-9
 */
class DefaultGenTools implements GenTools {
    private _printer: PrettyPrinter;


    get printer() {
        return this._printer;
    }


    public static newInst(printer: PrettyPrinter): DefaultGenTools {
        var genTools = new DefaultGenTools();
        genTools._printer = printer;
        return genTools;
    }


    public indent(dst: string[], lines: string | string[]): string[] {
        if (lines == null) {
            return dst;
        }

        var indent = this._printer.getIndent();

        if (typeof lines === "string") {
            dst.push(indent + lines);
            return dst;
        }

        for (var i = 0, size = lines.length; i < size; i++) {
            dst.push(indent + lines[i]);
        }
        return dst;
    }


    public indentNonEmpty(dst: string[], strs: string | string[]): string[] {
        var indent = this._printer.getIndent();

        if (typeof strs === "string") {
            dst.push(indent + strs);
            return dst;
        }

        for (var i = 0, size = strs.length; i < size; i++) {
            var str = strs[i];
            dst.push((str && str.length > 0) ? (indent + str) : str);
        }
        return dst;
    }

}

export = DefaultGenTools;
