/** Interfaces to represent type usage information.
 * Useful for tracking type information from AST extractions/transforms.
 * @author TeamworkGuy2
 */
declare module TypeUsage {

    export interface Annotation {
        class: CodeAst.Class;
        annotation: CodeAst.Annotation;
    }


    export interface Field {
        class: CodeAst.Class;
        field: CodeAst.Field;
    }


    export interface MethodParameter {
        class: CodeAst.Class;
        method: CodeAst.Method;
        parameter: CodeAst.MethodParameter;
    }


    export interface MethodReturn {
        class: CodeAst.Class;
        method: CodeAst.Method;
        returnType: CodeAst.Type;
    }


    export interface ClassExtends {
        class: CodeAst.Class;
        extendType: string;
    }


    export interface ClassImplements {
        class: CodeAst.Class;
        implementType: string;
    }


    /** Common type for all type usages
     */
    export type Any = (Annotation | Field | MethodParameter | MethodReturn | ClassExtends | ClassImplements);

}