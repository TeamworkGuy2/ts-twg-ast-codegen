/** Data types for source code ASTs
 * @author TeamworkGuy2
 * @since 2016-05-13
 */
declare module CodeBlock {

    export interface Accessible {
        comments?: string[];
        accessModifiers: string[];
        annotations?: string[];
    }


    export interface Executable extends Accessible {
        name: string;
        parameters?: ParameterInfo[];
        code: string[];
    }


    export interface ClassHeader extends Accessible {
        genericParameters?: CodeAst.Type[];
        className: string;
    }


    export interface Constructor extends Executable {
    }


    export interface Method extends Executable {
        returnType: CodeAst.Type;
    }


    export interface PropertyMethodMeta extends Accessible, PropInfo {
    }

}