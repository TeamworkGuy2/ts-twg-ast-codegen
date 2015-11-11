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


interface PropInfo extends TypeInfo {
    propName: string;
    required?: boolean;
    defaultValue?: any;
}


interface PropertyField extends PropInfo {
    readOnly?: boolean;
}


interface TypeProperty extends TypeInfo {
    /** the property's data type, used to fill in default 'value', 'toService', 'toLocal', etc. */
    type: string;
    /** default value of the property */
    defaultValue?: any;
    /** true if this property is a primary key for the model, false or absent if not */
    primaryKey?: boolean;
    /** true if this property should be automatically generated (only applies to 'primaryKey: true' properties), false or absent if not */
    autoGenerate?: boolean;
    /** true to require this property in model with optional properties, 'primaryKey' properties are implicitely required */
    required?: boolean;
    /** read-only */
    readOnly?: boolean;
}


interface ServiceProperty extends TypeProperty {
    /** the service property name */
    servicePropName?: string;
    /** the service property's data type, defaults to the same value as 'type' */
    servicePropType?: string; //PropertyType;
    /** template code can be used to convert the property to a value that can be sent to a web service */
    toService?: string;
    /** template code can be used to get this property from another object and convert it to a valid value for this model */
    toLocal?: string;
}


interface NamedProperty extends TypeProperty {
    /** the name of the property */
    name: string;
}


interface NamedServiceProperty extends ServiceProperty {
    /** the name of the property */
    name: string;
}


interface TypesDefinition {
    /** the properties/fields this model has, see {@link ModelProperty} */
    properties: { [id: string]: TypeProperty };
}


interface WebServiceModelDef {
    toServiceNameConverter: (string) => string; // a function that takes a 'properties.propName' string and converts it to a different format for service calls
    /** the properties/fields this model has, see {@link ModelProperty} */
    properties: { [id: string]: ServiceProperty };
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


interface PropertyMethodMeta extends AccessibleBlock, PropertyField {
}
