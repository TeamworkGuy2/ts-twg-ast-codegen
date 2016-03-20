
/** Types exported to JSON definition files by 'jparser-tools' (https://github.com/TeamworkGuy2/JParserTools)
 */
declare module CodeAst {

    export interface Class {
        classSignature: {
            access: string;
            name: string;
            declarationType: string;
            genericParameters: GenericType[];
            extendClassName?: GenericType;
            implementClassNames?: GenericType[];
        };
        using: string[];
        fields: Field[];
        methods: Method[];
    }


    export interface GenericType {
        typeName: string;
        nullable?: boolean;
        arrayDimensions?: number;
        genericParameters?: GenericType[];
    }


    export interface Field {
        name: string;
        type: GenericType;
        accessModifiers: string[];
        comments: string[];
    }


    export interface Method {
        name: string;
        parameters: MethodParameter[];
        accessModifiers: string[];
        returnType: GenericType;
        annotations: Annotation[];
        comments: string[];
    }


    export interface MethodParameter {
        name: string;
        type: GenericType;
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