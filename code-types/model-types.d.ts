/// <reference path="../../definitions/gulp-util/gulp-util.d.ts" />
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


/** Database column meta-data */
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


/** Database column definition with meta-data */
interface TypeProperty extends TypeMetaData {
    /** the property's data type */
    type: CodeAst.Type;
    /** default value of the property */
    defaultValue?: any;
}


interface NamedProperty extends TypeProperty {
    /** the name of the property */
    name: string;
}


interface PropertyConversionTemplate {
    /** template code can be used to get this property from another object and convert it to a valid value for this model */
    toLocal?: string;
    /** template code can be used to convert the property to a value that can be sent to a web service */
    toService?: string;
}


/** A database column definition with meta-data paired with a 'server' database column definition with meta-data */
interface DtoProperty extends TypeProperty, PropertyConversionTemplate {
    /** if not present, server property type data is copied from this DtoProperty */
    server: TypeProperty & { name: string, toLocal?: string };
    toLocal: string;
    toService: string;
}


interface DtoPropertyNamed extends DtoProperty {
    /** the name of the property */
    name: string;
}


/** A type template and database column meta-data paired with a 'server' type template with database column meta-data and property name */
interface DtoPropertyTemplate extends TypeTemplate, TypeMetaData, PropertyConversionTemplate {
    /** if not present, server property type data is copied from this DtoProperty */
    server?: TypeTemplate & TypeMetaData & { name?: string, toLocal?: string };
}


interface DtoPropertyTemplateNamed extends DtoPropertyTemplate {
    /** the name of the property */
    name: string;
}


    /** the properties/fields this model has, see {@link DtoProperty} */
interface DtoPropertyMap {
    [id: string]: DtoProperty;
}


/** the properties/fields this model has, see {@link DtoPropertyTemplate} */
interface DtoPropertyTemplateMap {
    [id: string]: DtoPropertyTemplate;
}


interface DtoModel {
    properties: DtoPropertyMap;
}


interface DtoModelTemplate {
    properties: DtoPropertyTemplateMap;
}


interface DtoModelNamed extends DtoModel {
    /** the name of the data model */
    name: string;
}


interface DtoModelTemplateNamed extends DtoModelTemplate {
    /** the name of the data model */
    name: string;
}
