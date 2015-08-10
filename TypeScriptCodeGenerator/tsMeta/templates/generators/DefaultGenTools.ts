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


    public addIndent(lines: string[]): string[]{
        if (lines == null) {
            return [];
        }
        var indent = this._printer.getIndent();
        for (var i = 0, size = lines.length; i < size; i++) {
            lines[i] = indent + lines[i];
        }
        return lines;
    }


    public getIndent(): string {
        return this._printer.getIndent();
    }


    public indent(levels?: number): void {
        this._printer.indent(levels);
    }


    public deindent(levels?: number): void {
        this._printer.deindent(levels);
    }

}

export = DefaultGenTools;
