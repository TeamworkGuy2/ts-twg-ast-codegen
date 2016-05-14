/** C# source code AST types
 * @since 2016-05-13
 */
declare module CsSource {

    export interface Constructor extends CodeBlock.Constructor {
    }


    export interface Method extends CodeBlock.Method {
        returnType: CodeAst.Type;
    }


    export interface Property extends CodeBlock.PropertyMethodMeta {
    }


    export interface ClassHeader extends CodeBlock.ClassHeader {
    }


    export interface ClassMeta {
        classStart: ClassHeader;
        fields: PropInfo[];
        classConstructors: Constructor[]
        properties: CodeBlock.PropertyMethodMeta[];
        instanceMethods: Method[];
        staticMethods: Method[];
    }


    export interface ClassWithImportExport extends ClassMeta {
        classImports: string[];
        classExport?: string[];
    }


    export interface Namespace {
        classImports: string[];
        namespaceStart: string[];
        classes: ClassMeta[];
        namespaceEnd: string[];
    }


    // ==== lines ====
    export interface ClassSourceLines {
        classComments: string[];
        annotations: string[];
        classStart: string[];
        fields: string[];
        classConstructors: string[];
        properties: string[];
        instanceMethods: string[];
        staticMethods: string[];
        classEnd: string[];
    }

}