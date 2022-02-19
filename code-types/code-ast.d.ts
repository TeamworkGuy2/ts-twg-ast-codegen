﻿/** Types exported to JSON definition files by 'jparse-code@0.23.0' (https://github.com/TeamworkGuy2/JParserCode)
 * @author TeamworkGuy2
 */
declare module CodeAst {

    export interface Class {
        classSignature: ClassSignature;
        blockType: string;
        using: string[];
        enumMembers?: Field[];
        fields: Field[];
        methods: Method[];
    }


    export interface ClassSignature {
        access: string;
        name: string;
        declarationType: string;
        genericParameters?: Type[];
        extendClassName?: Type;
        implementClassNames?: Type[];
        annotations?: Annotation[];
        comments?: string[];
    }


    export interface Type {
        typeName: string;
        nullable?: boolean;
        primitive?: boolean;
        arrayDimensions?: number;
        genericParameters?: Type[];
    }


    export interface Field {
        name: string;
        type: Type;
        accessModifiers: string[];
        annotations?: Annotation[];
        comments?: string[];
        initializer?: number | boolean | string | null;
        initializerExpression?: string | null;
        required?: boolean; // for compatiblity with Dto types
    }


    export interface Method {
        name: string;
        parameters: MethodParameter[];
        accessModifiers: string[];
        typeParameters?: Type[];
        annotations?: Annotation[];
        returnType: Type;
        comments?: string[];
    }


    export interface MethodParameter {
        name: string;
        type: Type;
        parameterModifiers: string[];
        annotations?: Annotation[];
        optional?: boolean;
        defaultValue?: string;
    }


    export interface Annotation {
        name: string;
        arguments: StringMap<string>;
    }

}