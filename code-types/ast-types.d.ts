
/** Types exported to JSON definition files by 'jparse-code' (https://github.com/TeamworkGuy2/JParserCode)
 */
declare module CodeAst {

    export interface Class {
        classSignature: ClassSignature;
        blockType: string;
        using: string[];
        enumMembers?: (Field & { initializer?: number | boolean | string | null; initializerExpression?: string; })[];
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
        required?: boolean;
        accessModifiers: string[];
        annotations: Annotation[];
        comments: string[];
    }


    export interface Method {
        name: string;
        parameters: MethodParameter[];
        accessModifiers: string[];
        returnType: Type;
        annotations: Annotation[];
        comments: string[];
    }


    export interface MethodParameter {
        name: string;
        type: Type;
        optional?: boolean;
        defaultValue?: string;
    }


    export interface Annotation {
        name: string;
        arguments: {
            ResponseFormat?: string;
            RequestFormat?: string;
            Method?: string;
            UriTemplate?: string;
        };
    }

}