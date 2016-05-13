/** Data types for source code ASTs
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
        parameters?: PropInfo[];
        code: string[];
    }


    export interface ClassHeader extends Accessible {
        genericParameters?: string[];
        className: string;
    }


    export interface Constructor extends Executable {
    }


    export interface Method extends Executable {
        returnType: string;
    }


    export interface PropertyMethodMeta extends Accessible, PropInfo {
    }

}