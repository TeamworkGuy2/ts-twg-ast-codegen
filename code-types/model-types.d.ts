// Type definitions for code generators

interface IndexMap<T> {
    [id: number]: T;
}


interface StringMap<T> {
    [id: string]: T;
}


/** A simple type template, the type string contains an easy to parse type */
interface TypeTemplate {
    /** the property's data type.
     * If this is a string, the format must be 'typeName?[][]...' where typeName has no generic parameters, and the '?' (nullability) and '[][]...' (array dimensions) are optional
     */
    type: string | CodeAst.Type;
    /** true to require this property in models with optional properties, 'primaryKey' properties are implicitely required */
    required?: boolean;
    /** default value of the property */
    defaultValue?: any;
}


/** Database column like attributes */
interface TypeMetaData {
    /** true if this property should be automatically generated (only applies to 'primaryKey: true' properties), false or absent if not */
    autoGenerate?: boolean;
    /** true if this property is a primary key for the model, false or absent if not */
    primaryKey?: boolean;
    /** true if the property is const/final/readonly, default false */
    readOnly?: boolean;
    /** true to require this property in models with optional properties, 'primaryKey' properties are implicitely required */
    required?: boolean;
}


/** Type information about a model property */
interface PropInfo {
    /** the property's data type */
    type: CodeAst.Type;
    /** the name of the property */
    propName: string;
    /** the property's default value (e.g. null, 0, ""), defaults to data type default (i.e. null for objects, 0 for numeric types, false for boolean */
    defaultValue?: any;
    /** true if the property is const/final/readonly, default false */
    readOnly?: boolean;
}


/** Type information about a method parameter */
interface ParameterInfo {
    /** the parameter's data type */
    type: CodeAst.Type;
    /** the name of the parameter */
    paramName: string;
    /** the parameter's default value (e.g. null, 0, ""), defaults to data type default (i.e. null for objects, 0 for numeric types, false for boolean */
    defaultValue?: any;
    /** true if the parameter is const/final/readonly, default false */
    readOnly?: boolean;
    /** true to require this parameter in models with optional properties, 'primaryKey' properties are implicitely required */
    required?: boolean;
}


interface TypeProperty extends TypeMetaData {
    /** the property's data type */
    type: CodeAst.Type;
    /** default value of the property */
    defaultValue?: any;
}


interface TypesDefinition {
    /** the properties/fields this model has, see {@link TypeProperty} */
    properties: { [id: string]: TypeProperty };
}


interface NamedProperty extends TypeProperty {
    /** the name of the property */
    name: string;
}


interface OptionalNamedProperty extends TypeProperty {
    /** the name of the property */
    name?: string;
}


interface DtoProperty extends TypeProperty {
    /** if not present, server property type data is copied from this DtoProperty */
    server?: OptionalNamedProperty;
}


interface DtoPropertyTemplate extends DtoProperty {
    /** template code can be used to convert the property to a value that can be sent to a web service */
    toService?: string;
    /** template code can be used to get this property from another object and convert it to a valid value for this model */
    toLocal?: string;
}


interface DtoPropertyTemplateNamed extends DtoPropertyTemplate {
    /** the name of the property */
    name: string;
}


interface DtoModelTemplate {
    toServiceNameConverter: (name: string) => string; // a function that takes a 'properties.propName' string and converts it to a different format for service calls
    /** the properties/fields this model has, see {@link ServiceProperty} */
    properties: { [id: string]: DtoPropertyTemplate };
}


interface DtoModelTemplateNamed extends DtoModelTemplate {
    /** the name of the data model */
    name: string;
}
