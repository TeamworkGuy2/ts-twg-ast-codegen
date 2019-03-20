
/**
 * @author TeamworkGuy2
 * @since 2015-8-9
 */
class DefaultPrettyPrinter implements PrettyPrinter {
    private defaultIndent: string;
    private currentLevel: number;
    private currentIndent: string;


    constructor(defaultIndent: string, currentLevel: number, currentIndent: string) {
        this.defaultIndent = defaultIndent;
        this.currentLevel = currentLevel;
        this.currentIndent = currentIndent;
    }


    public getIndent(): string {
        return this.currentIndent;
    }


    public indent(levels: number = 1): void {
        var indentStr = this.currentIndent + (levels === 1 ? this.defaultIndent : this.defaultIndent.repeat(levels));
        this.currentIndent = indentStr;
        this.currentLevel += levels;
    }


    public dedent(levels: number = 1): void {
        if (this.currentLevel - levels < 0) {
            throw new Error("cannot reduce indentation by " + levels + ", current level is " + this.currentLevel);
        }

        var indentStr = this.currentIndent.substr(0, (this.currentLevel - levels) * this.defaultIndent.length);
        this.currentIndent = indentStr;
        this.currentLevel -= levels;
    }


    public static newInst(indent: string, startLevel: number = 0): DefaultPrettyPrinter {
        var indentStr = indent.repeat(startLevel);
        var pp = new DefaultPrettyPrinter(indent, startLevel, indentStr);
        return pp;
    }

}

export = DefaultPrettyPrinter;
