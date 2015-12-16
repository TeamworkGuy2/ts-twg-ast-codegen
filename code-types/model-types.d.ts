// Type definitions for code generators

interface IndexMap<T> {
    [id: number]: T;
}


interface StringMap<T> {
    [id: string]: T;
}


interface TypeInfo {
    /** the property's data type */
    type: string;
    required?: boolean;
}


interface TypeMetaData {
    /** true if this property should be automatically generated (only applies to 'primaryKey: true' properties), false or absent if not */
    autoGenerate?: boolean;
    /** true if this property is a primary key for the model, false or absent if not */
    primaryKey?: boolean;
    /** read-only */
    readOnly?: boolean;
    /** true to require this property in model with optional properties, 'primaryKey' properties are implicitely required */
    required?: boolean;
}


interface PropInfo extends TypeInfo {
    propName: string;
    defaultValue?: any;
    readOnly?: boolean;
}


interface TypeProperty extends TypeInfo, TypeMetaData {
    /** default value of the property */
    defaultValue?: any;
}


interface NamedProperty extends TypeProperty {
    /** the name of the property */
    name: string;
}


interface DtoProperty extends TypeMetaData, TypeProperty {
    server: TypeProperty;
}


interface NamedDtoProperty extends DtoProperty {
    /** the name of the property */
    name: string;
}


interface DtoPropertyTemplate extends DtoProperty {
    /** template code can be used to convert the property to a value that can be sent to a web service */
    toService?: string;
    /** template code can be used to get this property from another object and convert it to a valid value for this model */
    toLocal?: string;
}


interface TypesDefinition {
    /** the properties/fields this model has, see {@link TypeProperty} */
    properties: { [id: string]: TypeProperty };
}


interface DtoModelTemplate {
    toServiceNameConverter: (name: string) => string; // a function that takes a 'properties.propName' string and converts it to a different format for service calls
    /** the properties/fields this model has, see {@link ServiceProperty} */
    properties: { [id: string]: DtoPropertyTemplate };
}


// ==== methods ====

interface AccessibleBlock {
    comments?: string[];
    accessModifiers: string[];
    annotations?: string[];
}


interface ExecutableBlock extends AccessibleBlock {
    name: string;
    parameters?: PropInfo[];
    code: string[];
}


interface ClassHeader extends AccessibleBlock {
    genericParameters?: string[];
    className: string;
}


interface ConstructorBlock extends ExecutableBlock {
}


interface MethodBlock extends ExecutableBlock {
    returnType: string;
}


interface PropertyMethodMeta extends AccessibleBlock, PropInfo {
}
