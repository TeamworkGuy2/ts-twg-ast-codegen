
interface GenTools extends PrettyPrinter {

    addIndent(lines: string[]): string[];

}


interface PrettyPrinter {

    getIndent(): string;

    indent(levels?: number): void;

    deindent(levels?: number): void;
}
