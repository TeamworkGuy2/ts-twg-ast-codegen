
interface GenTools {

    indent(lines: string[], dst?: string[]): string[];

    indentNonEmpty(strs: string[], dst?: string[]): string[];

    addIndent(dst: string[], str: string): string[];

    addIndentsToNonEmpty(dst: string[], strs: string[]): string[];

    printer: PrettyPrinter;
}


interface PrettyPrinter {

    getIndent(): string;

    indent(levels?: number): void;

    deindent(levels?: number): void;
}
