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


    public indent(lines: string[], dst: string[] = []): string[] {
        if (lines == null) {
            return dst;
        }
        var indent = this._printer.getIndent();
        for (var i = 0, size = lines.length; i < size; i++) {
            dst[i] = indent + lines[i];
        }
        return dst;
    }


    public indentNonEmpty(strs: string[], dst: string[] = []): string[] {
        var indent = this._printer.getIndent();
        for (var i = 0, size = strs.length; i < size; i++) {
            var str = strs[i];
            if (str && str.length > 0) {
                dst.push(indent + str);
            }
        }
        return dst;
    }


    public addIndent(dst: string[], str: string): string[] {
        dst.push(this._printer.getIndent() + str);
        return dst;
    }


    public addIndentsToNonEmpty(dst: string[], strs: string[]): string[] {
        return this.indentNonEmpty(strs, dst);
    }

}

export = DefaultGenTools;
