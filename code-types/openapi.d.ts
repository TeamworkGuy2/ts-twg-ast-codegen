/** Interfaces for modeling the Open API Spec
 * @see https://swagger.io/specification/
 * @see https://swagger.io/specification/v2/
 * Similar prior work:
 * @see https://github.com/kogosoftwarellc/open-api/blob/dae0e37fb6e1b67265111fca3ef7f2049736cfb8/packages/openapi-types/index.ts
 * @see https://github.com/ferdikoomen/openapi-typescript-codegen/blob/e65f2521b11febfaa50c93a29ae576d8e7f381b5/src/openApi/v2/interfaces/OpenApi.d.ts
 * @see https://github.com/drwpow/openapi-typescript/blob/bfe51e3e5dc3b5838a0d80efdeb5ff91fb9d37f5/src/types.ts
 * @example https://petstore.swagger.io/
 * @author TeamworkGuy2
 */
declare module OpenApiV2 {

    export interface TypeArray {
        type: "array";
        items: Type;
        maxItems?: number;
        description?: string;
    }


    export interface TypeObject {
        type: "object";
        additionalProperties?: boolean;
        required?: string[];
        properties: { [name: string]: Type | Reference };
        description?: string;
    }


    export interface TypeString {
        type: "string";
        maxLength?: number;
        enum?: string[];
        format?: "byte" | "binary" | "date" | "date-time" | "password";
        description?: string;
    }


    export interface TypePrimitive {
        type: "number" | "integer" | "boolean";
        format?: "int32" | "int64" | "float" | "double";
        description?: string;
    }


    export type Type = TypeArray | TypeObject | TypeString | TypePrimitive;


    export type PathOperationType = "get" | "post" | "put" | "delete" | "options" | "head" | "patch";


    export interface Document {
        /** Required. Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be "2.0". */
        swagger: string;
        /** Required. Provides metadata about the API. The metadata can be used by the clients if needed. */
        info: Info;
        host?: string;
        basePath?: string;
        schemes?: ("http" | "https" | "ws" | "wss")[];
        consumes?: string[];
        produces?: string[];
        paths?: Paths;
        definitions?: Definitions;
        parameters?: Parameters;
        responses?: Responses;
        securityDefinitions?: SecurityDefinitions;
        security?: SecurityRequirement[];
        tags?: Tag[];
        /** Additional external documentation. */
        externalDocs?: ExternalDocumentation;
        /** Allows extensions to the Swagger Schema. The field name MUST begin with x-, for example, x-internal-id. The value can be null, a primitive, an array or an object.
         * See [Vendor Extensions](https://swagger.io/specification/v2/#vendorExtensions) for further details. */
        [extensions: string]: any;
    }


    /** Contact information for the exposed API.
     */
    export interface Contact {
        /** The identifying name of the contact person/organization. */
        name?: string;
        /** The URL pointing to the contact information. MUST be in the format of a URL. */
        url?: string;
        /** The email address of the contact person/organization. MUST be in the format of an email address. */
        email?: string;
    }


    /** An object to hold data types that can be consumed and produced by operations. These data types can be primitives, arrays or models.
     */
    export interface Definitions {
        /** A single definition, mapping a "name" to the schema it defines. */
        [name: string]: Schema | Reference;
    }


    /** The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in the Swagger-UI for convenience.
     */
    export interface Info {
        title: string;
        version: string;
        description?: string;
        termsOfService?: string;
        contact?: Contact;
        license?: License;
    }


    /** Allows sharing examples for operation responses.
     * The name of the property MUST be one of the Operation produces values (either implicit or inherited). The value SHOULD be an example of what such a response would look like.
     * */
    export interface Example {
        [mimeType: string]: any;
    }


    /** Allows referencing an external resource for extended documentation.
     */
    export interface ExternalDocumentation {
        /** Required. The URL for the target documentation. Value MUST be in the format of a URL. */
        url: string;
        /** A short description of the target documentation. GFM syntax can be used for rich text representation. */
        description?: string;
    }


    /** Lists the headers that can be sent as part of a response.
     */
    export interface Headers {
        /** The name of the property corresponds to the name of the header. The value describes the type of the header. */
        [name: string]: Header;
    }


    export interface Header extends ItemsLike {
        /** Required. The type of the object. The value MUST be one of "string", "number", "integer", "boolean", or "array". */
        type: "string" | "number" | "integer" | "boolean" | "array";
        /** The extending format for the previously mentioned type. See Data Type Formats for further details. */
        format?: string;
        /** Required if type is "array". Describes the type of items in the array. */
        items?: Items;
        /** A short description of the header. */
        description?: string;

    }


    /** A limited subset of JSON-Schema's items object. It is used by parameter definitions that are not located in "body".
     */
    export interface Items extends ItemsLike {
        type: "string" | "number" | "integer" | "boolean" | "array";
        format?: string;
        items?: Items;
    }


    /** License information for the exposed API.
     */
    export interface License {
        /** Required. The license name used for the API. */
        name: string;
        /** A URL to the license used for the API. MUST be in the format of a URL. */
        url?: string;
    }


    /** Describes a single API operation on a path.
     */
    export interface Operation {
        responses: Responses;
        operationId?: string;
        /** A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier. */
        tags?: string[];
        summary?: string;
        description?: string;
        externalDocs?: ExternalDocumentation;
        consumes?: string[];
        produces?: string[];
        parameters?: (Parameter | Reference)[];
        schemes?: ("http" | "https" | "ws" | "wss")[];
        deprecated?: boolean;
        security?: SecurityRequirement[];
    }


    export interface ItemsLike {
        /** Determines the format of the array if type array is used. Possible values are:
         *   - csv - comma separated values foo,bar.
         *   - ssv - space separated values foo bar.
         *   - tsv - tab separated values foo\tbar.
         *   - pipes - pipe separated values foo|bar.
         *   - multi - corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in "query" or "formData".
         * Default value is csv. */
        collectionFormat?: string;
        /** Declares the value of the parameter that the server will use if none is provided, for example a "count" to control the number of results per page might default to 100 if not supplied by the
         * client in the request. (Note: "default" has no meaning for required parameters.) See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2.
         * Unlike JSON Schema this value MUST conform to the defined type for this parameter. */
        default?: any;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2. */
        maximum?: number;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2. */
        exclusiveMaximum?: boolean;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3. */
        minimum?: number;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3. */
        exclusiveMinimum?: boolean;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1. */
        maxLength?: number; // integer
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2. */
        minLength?: number; // integer
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3. */
        pattern?: string;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2. */
        maxItems?: number; // integer
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3. */
        minItems?: number; // integer
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4. */
        uniqueItems?: boolean;
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1. */
        enum?: any[];
        /** See https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1. */
        multipleOf?: number;
    }


    /** An object to hold parameters to be reused across operations. Parameter definitions can be referenced to the ones defined here.
     * This does not define global operation parameters.
     * A single parameter definition, mapping a "name" to the parameter it defines.
     */
    export interface Parameters {
        [name: string]: (Parameter | Reference);
    }


    /** Describes a single operation parameter. A unique parameter is defined by a combination of a name and location.
     * There are five possible parameter types.
     *   1. Path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API.
     *      For example, in /items/{itemId}, the path parameter is itemId.
     *   2. Query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
     *   3. Header - Custom headers that are expected as part of the request.
     *   4. Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be one body parameter. The name of the body parameter has no effect on the
     *      parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
     *   5. Form - Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request
     *      (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type.
     *      Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the
     *      content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
     *     - application/x-www-form-urlencoded - Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger - both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
     *     - multipart/form-data - each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers
     */
    export interface ParameterBase {
        /** Required. The name of the parameter. Parameter names are case sensitive.
         * If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.
         * For all other cases, the name corresponds to the parameter name used based on the in property. */
        name: string;
        /** Required. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body". */
        in: ("body" | "formData" | "header" | "path" | "query");
        /** A brief description of the parameter. This could contain examples of use. GFM syntax can be used for rich text representation. */
        description?: string;
        /** Determines whether this parameter is mandatory. If the parameter is in "path", this property is required and its value MUST be true.
         * Otherwise, the property MAY be included and its default value is false. */
        required?: boolean;
        [index: string]: any; // allow extensions
    }


    export interface ParameterNotBody extends ParameterBase, ItemsLike {
        /** Required. The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object).
         * The value MUST be one of "string", "number", "integer", "boolean", "array" or "file". If type is "file", the consumes MUST be either "multipart/form-data",
         * "application/x-www-form-urlencoded" or both and the parameter MUST be in "formData". */
        type: "string" | "number" | "integer" | "boolean" | "array" | "file";
        /** Required if type is "array". Describes the type of items in the array. */
        items?: Items;
        /** The extending format for the previously mentioned type. See Data Type Formats for further details. */
        format?: string;
        /** Sets the ability to pass empty-valued parameters. This is valid only for either query or formData parameters and allows you to send a parameter with a name only or an empty value.
         * Default value is false. */
        allowEmptyValue?: boolean;
    }


    export interface ParameterBody extends ParameterBase {
        in: "body";
        /** Required. The schema defining the type used for the body parameter. */
        schema: Schema | Reference;
    }


    export interface ParameterFormData extends ParameterNotBody {
    }


    export interface ParameterHeader extends ParameterNotBody {
        in: "header";
    }


    export interface ParameterPath extends ParameterNotBody {
        in: "path";
        required: boolean;
    }


    export interface ParameterQuery extends ParameterNotBody {
        in: "query";
    }


    export type Parameter = (ParameterBody | ParameterFormData | ParameterHeader | ParameterPath | ParameterQuery);


    export interface PathItemBase {
        /** Allows for an external definition of this path item. The referenced structure MUST be in the format of a Path Item Object.
         * If there are conflicts between the referenced definition and this Path Item's definition, the behavior is undefined. */
        $ref?: string;
        /** A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there.
         * The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that
         * are defined at the Swagger Object's parameters. There can be one "body" parameter at most. */
        parameters?: (Parameter | Reference)[];
        [index: string]: any; // allow extensions
    }


    /** Describes the operations available on a single path. A Path Item may be empty, due to ACL constraints.
     * The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
     */
    export type PathItem = PathItemBase & { [K in PathOperationType]?: Operation };


    /** Holds the relative paths to the individual endpoints. The path is appended to the basePath in order to construct the full URL. The Paths may be empty, due to ACL constraints.
     * A relative path to an individual endpoint. The field name MUST begin with a slash. Path templating is allowed.
     */
    export interface Paths {
        [path: string]: PathItem;
    }


    /** A simple object to allow referencing other definitions in the specification. It can be used to reference parameters and responses that are defined at the top level for reuse.
     * The Reference Object is a JSON Reference that uses a JSON Pointer as its value. For this specification, only canonical dereferencing is supported.
     */
    export interface Reference {
        /** Required. The reference string. */
        $ref: string;
    }


    export interface ResponsesBase {
        /** The documentation of responses other than the ones declared for specific HTTP response codes. It can be used to cover undeclared responses.
         * Reference Object can be used to link to a response that is defined at the Swagger Object's responses section. */
        default?: Response | Reference;
    }


    /** A container for the expected responses of an operation. The container maps a HTTP response code to the expected response. It is not expected from the documentation to necessarily cover all
     * possible HTTP response codes, since they may not be known in advance. However, it is expected from the documentation to cover a successful operation response and any known errors.
     * The default can be used as the default response object for all HTTP codes that are not covered individually by the specification.
     * The Responses Object MUST contain at least one response code, and it SHOULD be the response for a successful operation call.
     * Any HTTP status code can be used as the property name (one property per HTTP status code). Describes the expected response for that HTTP status code.
     * Reference Object can be used to link to a response that is defined at the Swagger Object's responses section.
     * SHOULD be one of ["100"-"599"] | "1XX" | "2XX" | "3XX" | "4XX" | "5XX" | "default"
     */
    export type Responses = ResponsesBase & { [httpStatusCode: string]: Response | Reference };


    /** Describes a single response from an API Operation.
     */
    export interface Response {
        /** Required. A short description of the response. GFM syntax can be used for rich text representation. */
        description: string;
        /** A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response.
         * As an extension to the Schema Object, its root type value may also be "file". This SHOULD be accompanied by a relevant produces mime-type. */
        schema?: Schema | Reference;
        /** A list of headers that are sent with the response. */
        headers?: Headers;
        /** An example of the response message. */
        examples?: Example;
        [index: string]: any;
    }


    export interface SchemaBase {
        // The following properties are taken directly from the JSON Schema definition and follow the same specifications:
        //$ref: Reference;
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type?: "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";
        /** See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats. */
        format?: string; // "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";
        /** Used to decorate a user interface with information about the data produced by this user interface. A title will preferably be short. */
        title?: string;
        /** A description provides explanation about the purpose of the instance described by this schema. CommonMark syntax MAY be used for rich text representation. */
        description?: string;
        /** The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided.
         * Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object. */
        default?: any;
        enum?: any[];
        // Additional fields
        /** Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema.
         * The property name used MUST be defined at this schema and it MUST be in the required property list. When used, the value MUST be the name of this schema or any schema that inherits it. */
        discriminator?: string;
        /** Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request.
         * Properties marked as readOnly being true SHOULD NOT be in the required list of the defined schema. Default value is false. */
        readOnly?: boolean;
        /** This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property. */
        xml?: Xml;
        /** Additional external documentation for this schema. */
        externalDocs?: ExternalDocumentation;
        /** A free-form property to include an example of an instance for this schema. */
        example?: any;
        // JSON schema defaults/extensions
        [index: string]: any;
    }


    export interface SchemaAllOf {
        /** Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. */
        allOf: (Schema | Reference)[];
    }


    export interface SchemaArray {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "array";
        /** Value MUST be an object and not an array. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. items MUST be present if the type is array. */
        items?: Schema | Reference;
        /** The value of this keyword MUST be a non-negative integer.
         * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword. */
        maxItems?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword.
         * Omitting this keyword has the same behavior as a value of 0. */
        minItems?: number;
        /** The value of this keyword MUST be a boolean.
         * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
         * Omitting this keyword has the same behavior as a value of false. */
        uniqueItems?: boolean;
    }


    export interface SchemaBoolean {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "boolean";
    }


    export interface SchemaNumber {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "number" | "integer";
        /** See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats. */
        format?: "int32" | "int64" | "float" | "double";
        /** The value of "multipleOf" MUST be a number, strictly greater than 0.
         * A numeric instance is valid only if division by this keyword's value results in an integer. */
        multipleOf?: number;
        /** The value of "maximum" MUST be a number, representing an inclusive upper limit for a numeric instance.
         * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to "maximum". */
        maximum?: number;
        /** The value of "exclusiveMaximum" MUST be a number, representing an exclusive upper limit for a numeric instance.
         * If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) "exclusiveMaximum". */
        exclusiveMaximum?: number;
        /** The value of "minimum" MUST be a number, representing an inclusive lower limit for a numeric instance.
         * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to "minimum". */
        minimum?: number;
        /** The value of "exclusiveMinimum" MUST be a number, representing an exclusive lower limit for a numeric instance.
         * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) "exclusiveMinimum". */
        exclusiveMinimum?: number;
    }


    export interface SchemaNull {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "null";
    }


    export interface SchemaObject {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "object";
        /** Property definitions MUST be a Schema Object and not a standard JSON Schema (inline or referenced). */
        properties?: { [name: string]: Schema | Reference };
        /** Value can be boolean or object. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. Consistent with JSON Schema, additionalProperties defaults to true. */
        additionalProperties?: boolean | Schema | Reference;
        /** The value of this keyword MUST be an array. Elements of this array, if any, MUST be strings, and MUST be unique.
         * An object instance is valid against this keyword if every item in the array is the name of a property in the instance.
         * Omitting this keyword has the same behavior as an empty array. */
        required?: string[];
        /** The value of this keyword MUST be a non-negative integer.
         * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword. */
        maxProperties?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword.
         * Omitting this keyword has the same behavior as a value of 0. */
        minProperties?: number;
    }


    export interface SchemaString {
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type: "string";
        /** See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats. */
        format?: "byte" | "binary" | "date" | "date-time" | "password";
        /** The value of this keyword MUST be a non-negative integer.
         * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword. */
        maxLength?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword. 
         * Omitting this keyword has the same behavior as a value of 0. */
        minLength?: number;
        /** The value of this keyword MUST be a string. This string SHOULD be a valid regular expression, according to the ECMA-262 Edition 5.1 regular expression dialect.
         * A string instance is considered valid if the regular expression matches the instance successfully. Recall: regular expressions are not implicitly anchored. */
        pattern?: string;
    }


    /** The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is based on the JSON Schema Specification Draft 4 and
     * uses a predefined subset of it. On top of this subset, there are extensions provided by this specification to allow for more complete documentation.
     * Further information about the properties can be found in JSON Schema Core and JSON Schema Validation. Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.
     */
    export type Schema = SchemaBase & (SchemaAllOf | SchemaArray | SchemaBoolean | SchemaNumber | SchemaNull | SchemaObject | SchemaString);


    /** A declaration of the security schemes available to be used in the specification. This does not enforce the security schemes on the operations and only serves to provide the relevant details for each scheme.
     * A single security scheme definition, mapping a "name" to the scheme it defines.
     */
    export interface SecurityDefinitions {
        [name: string]: SecurityScheme;
    }


    /** Lists the required security schemes to execute this operation. The object can have multiple security schemes declared in it which are all required (that is, there is a logical AND between the schemes).
     * The name used for each property MUST correspond to a security scheme declared in the Security Definitions.
     * If the security scheme is of type "oauth2", then the value is a list of scope names required for the execution.
     * For other security scheme types, the array MUST be empty.
     */
    export interface SecurityRequirement {
        [name: string]: string[];
    }


    export interface SecuritySchemeBase {
        /** Required. The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2". */
        type: "basic" | "apiKey" | "oauth2";
        /** A short description for security scheme. */
        description?: string;
    }


    export interface SecuritySchemeBasic extends SecuritySchemeBase {
        /** Required. The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2". */
        type: "basic";

    }


    export interface SecuritySchemeApiKey extends SecuritySchemeBase {
        /** Required. The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2". */
        type: "apiKey";
        /** validity: apiKey - Required. The name of the header or query parameter to be used. */
        name: string;
        /** validity: apiKey - Required The location of the API key. Valid values are "query" or "header". */
        in: string;
    }


    export interface SecuritySchemeOauth2Base extends SecuritySchemeBase {
        /** Required. The type of the security scheme. Valid values are "basic", "apiKey" or "oauth2". */
        type: "oauth2";
        /** validity: oauth2 - Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode". */
        flow: string;
        /** validity: oauth2 - Required. The available scopes for the OAuth2 security scheme. */
        scopes: Scopes;
    }


    export interface SecuritySchemeOauth2Implicit extends SecuritySchemeOauth2Base {
        /** validity: oauth2 - Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode". */
        flow: "implicit";
        /** validity: oauth2 ("implicit", "accessCode") - Required. The authorization URL to be used for this flow. This SHOULD be in the form of a URL. */
        authorizationUrl: string;
    }


    export interface SecuritySchemeOauth2AccessCode extends SecuritySchemeOauth2Base {
        /** validity: oauth2 - Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode". */
        flow: "accessCode";
        /** validity: oauth2 ("implicit", "accessCode") - Required. The authorization URL to be used for this flow. This SHOULD be in the form of a URL. */
        authorizationUrl: string;
        /** validity: oauth2 ("password", "application", "accessCode") - Required. The token URL to be used for this flow. This SHOULD be in the form of a URL. */
        tokenUrl: string;
    }


    export interface SecuritySchemeOauth2Password extends SecuritySchemeOauth2Base {
        /** validity: oauth2 - Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode". */
        flow: "password";
        /** validity: oauth2 ("password", "application", "accessCode") - Required. The token URL to be used for this flow. This SHOULD be in the form of a URL. */
        tokenUrl: string;
    }


    export interface SecuritySchemeOauth2Application extends SecuritySchemeOauth2Base {
        /** validity: oauth2 - Required. The flow used by the OAuth2 security scheme. Valid values are "implicit", "password", "application" or "accessCode". */
        flow: "application";
        /** validity: oauth2 ("password", "application", "accessCode") - Required. The token URL to be used for this flow. This SHOULD be in the form of a URL. */
        tokenUrl: string;
    }


    export type SecuritySchemeOauth2 = SecuritySchemeOauth2Implicit | SecuritySchemeOauth2AccessCode | SecuritySchemeOauth2Password | SecuritySchemeOauth2Application;


    /** Allows the definition of a security scheme that can be used by the operations. Supported schemes are basic authentication, an API key (either as a header or as a query parameter) and
     * OAuth2's common flows (implicit, password, application and access code).
     */
    export type SecurityScheme = SecuritySchemeBasic | SecuritySchemeApiKey | SecuritySchemeOauth2;


    /** Lists the available scopes for an OAuth2 security scheme.
     * Maps between a name of a scope to a short description of it (as the value of the property).
     */
    export interface Scopes {
        [name: string]: string;
    }


    /** Allows adding meta data to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag used there.
     */
    export interface Tag {
        name: string;
        description?: string;
        externalDocs?: ExternalDocumentation;
    }


    /** A metadata object that allows for more fine-tuned XML model definitions.
     * When using arrays, XML element names are not inferred (for singular/plural forms) and the name property SHOULD be used to add that information. See examples for expected behavior.
     */
    export interface Xml {
        /** Replaces the name of the element/attribute used for the described schema property. When defined within the Items Object (items), it will affect the name of the individual XML elements within the list.
         * When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true. If wrapped is false, it will be ignored. */
        name?: string;
        /** The URL of the namespace definition. Value SHOULD be in the form of a URL. */
        namespace?: string;
        /** The prefix to be used for the name. */
        prefix?: string;
        /** Declares whether the property definition translates to an attribute instead of an element. Default value is false. */
        attribute?: boolean;
        /** MAY be used only for an array definition. Signifies whether the array is wrapped (for example, <books><book/><book/></books>) or unwrapped (<book/><book/>).
         * Default value is false. The definition takes effect only when defined alongside type being array (outside the items). */
        wrapped?: boolean;
    }

}


declare module OpenApiV3 {

    export type PathOperationType = "get" | "post" | "put" | "delete" | "options" | "head" | "patch" | "trace";


    /** This is the root document object of the [OpenAPI document](https://swagger.io/specification/#oas-document).
     */
    export interface Document {
        /** semantic version number of the OpenAPI specification version that this OpenAPI document uses */
        openapi: string;
        info: Info;
        paths: Paths;
        components?: Components;
        definitions?: { [name: string]: OpenApiV2.Type };
        externalDocs?: ExternalDocumentation;
        security?: SecurityRequirement[];
        servers?: Server[];
        tags?: Tag[];
        [extensions: string]: any;
    }


    export interface Callback {
        [callbackExpression: string]: PathItem;
    }


    /** Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from
     * properties outside the components object.
     */
    export interface Components {
        schemas?: { [name: string]: Schema | Reference };
        responses?: { [name: string]: Response | Reference };
        parameters?: { [name: string]: Parameter | Reference };
        examples?: { [name: string]: Example | Reference };
        requestBodies?: { [name: string]: RequestBody | Reference };
        headers?: { [name: string]: Header | Reference };
        securitySchemes?: { [name: string]: SecurityScheme | Reference };
        links?: { [name: string]: Link | Reference };
        callbacks?: { [name: string]: Callback | Reference };
    }


    /** Contact information for the exposed API.
     */
    export interface Contact {
        name?: string;
        url?: string;
        email?: string;
    }


    export interface Discriminator {
        /** REQUIRED. The name of the property in the payload that will hold the discriminator value. */
        propertyName: string;
        /** An object to hold mappings between payload values and schema names or references. */
        mapping?: { [payloadValue: string]: string };
    }


    export interface Encoding {
        contentType?: string;
        headers?: { [header: string]: Header | Reference };
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
    }


    export type Example = {
        summary?: string;
        description?: string;
        value?: any;
    } | {
        summary?: string;
        description?: string;
        externalValue?: string;
    };


    export interface ExternalDocumentation {
        url: string;
        description?: string;
    }


    /** The Header Object follows the structure of the Parameter Object with the following changes:
     *   1. name MUST NOT be specified, it is given in the corresponding headers map.
     *   2. in MUST NOT be specified, it is implicitly in header.
     *   3. All traits that are affected by the location MUST be applicable to a location of header (for example, style).
     */
    export type Header = ParameterBase & (Pick<ParameterAny, Exclude<keyof ParameterAny, "name" | "in">>) & ({
        example?: any;
    } | {
        examples?: { [value: string]: Example | Reference };
    }) & ({
        /** The schema defining the type used for the parameter. */
        schema?: Schema | Reference;
    } | {
        /** A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry. */
        content?: { [mediaType: string]: MediaType };
    });


    /** The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
     */
    export interface Info {
        title: string;
        version: string;
        description?: string;
        termsOfService?: string;
        contact?: Contact;
        license?: License;
    }


    /** License information for the exposed API.
     */
    export interface License {
        name: string;
        url?: string;
    }


    export type Link = ({
        operationRef: string;
    } | {
        operationId: string;
    }) & {
        parameters: { [parameterName: string]: any };
        requestBody?: any;
        description?: string;
        server?: Server;
    };


    export interface MediaType {
        schema?: Schema | Reference;
        example?: any;
        examples?: { [mediaType: string]: Example | Reference };
        encoding?: { [propertyName: string]: Encoding };
    }


    export interface Operation {
        operationId?: string;
        parameters?: (Parameter | Reference)[];
        /** SHOULD be one of ["100"-"599"] | "1XX" | "2XX" | "3XX" | "4XX" | "5XX" | "default" */
        responses: { [httpStatusCode: string]: Response | Reference };
        requestBody?: RequestBody | Reference;
        consumes?: string[];
        produces?: string[];
        callbacks?: { [callback: string]: Callback | Reference };
        deprecated?: boolean;
        description?: string;
        externalDocs?: ExternalDocumentation;
        schema?: Schema;
        security?: SecurityRequirement[];
        servers?: Server[];
        summary?: string;
        tags?: string[];
    }


    export interface PathItemBase {
        summary?: string;
        description?: string;
        servers?: Server[];
        parameters?: (Parameter | Reference)[];
    }


    export type PathItem = PathItemBase & { [K in PathOperationType]?: Operation };


    export interface Paths {
        [path: string]: PathItem | Reference;
    }


    export interface ParameterBase {
        allowEmptyValue?: boolean;
        description?: string;
        deprecated?: boolean;
        style?: string;
        explode?: boolean;
   }


    export interface ParameterHeader {
        in: "header";
        name: string;
        required?: boolean;
        format?: string;
    }


    export interface ParameterPath {
        in: "path";
        name: string;
        required: boolean;
        format?: string;
    }


    export interface ParameterCookie {
        in: "cookie";
        name: string;
        required?: boolean;
        type?: string;
    }


    export interface ParameterQuery {
        in: "query";
        name: string;
        required?: boolean;
        allowReserved?: boolean;
    }


    export interface ParameterBody {
        in: "body";
        name: string;
        required?: boolean;
    }


    /** Needed for 'Header' - as of TypeScript 4.3 cannot create a union of interfaces or extend multiple interfaces that have a different string type for the same property (i.e. 'name' in this case) */
    export interface ParameterAny extends ParameterBase/*, ParameterHeader, ParameterPath, ParameterCookie, ParameterQuery, ParameterBody*/ {
        in: "header" | "path" | "cookie" | "query";
        name: string;
        allowReserved?: boolean;
        format?: string;
        required?: boolean;
        type?: string;
    }


    export type Parameter = ParameterBase & (ParameterHeader | ParameterPath | ParameterCookie | ParameterQuery | ParameterBody) & ({
        example?: any;
    } | {
        examples?: { [value: string]: Example | Reference };
    }) & ({
        /** The schema defining the type used for the parameter. */
        schema?: Schema | Reference;
    } | {
        /** A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry. */
        content?: { [mediaType: string]: MediaType };
    });


    /** A simple object to allow referencing other components in the specification, internally and externally.
     * The Reference Object is defined by JSON Reference and follows the same structure, behavior and rules.
     * For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.
     */
    export interface Reference {
        /** REQUIRED. The reference string. */
        $ref: string;
    }


    export interface RequestBody {
        content: { [mediaType: string]: MediaType };
        description?: string;
        required?: boolean;
    }


    export type Response = {
        /** REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation. */
        description: string;
        /** A map containing descriptions of potential response payloads. The key is a media type or [media type range](https://tools.ietf.org/html/rfc7231#appendix--d) and the value describes it.
         * For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/* */
        content?: { [mediaType: string]: MediaType };
        /** A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects. */
        links?: { [shortName: string]: Link | Reference };
    } & ({
        schema: Schema | Reference;
        /** Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored. */
        headers?: StringMap<Header>;
    } | {
        schema?: Schema | { example: { code: string; message: string; description: string; transactionid: string } };
    });


    /** The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the JSON Schema Specification Wright Draft 00.
     * For more information about the properties, see JSON Schema Core and JSON Schema Validation. Unless stated otherwise, the property definitions follow the JSON Schema.
     */
    export interface Schema {
        // The following properties are taken directly from the JSON Schema definition and follow the same specifications:
        title?: string;
        /** The value of "multipleOf" MUST be a number, strictly greater than 0.
         * A numeric instance is valid only if division by this keyword's value results in an integer. */
        multipleOf?: number;
        /** The value of "maximum" MUST be a number, representing an inclusive upper limit for a numeric instance.
         * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to "maximum". */
        maximum?: number;
        /** The value of "exclusiveMaximum" MUST be a number, representing an exclusive upper limit for a numeric instance.
         * If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) "exclusiveMaximum". */
        exclusiveMaximum?: number;
        /** The value of "minimum" MUST be a number, representing an inclusive lower limit for a numeric instance.
         * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to "minimum". */
        minimum?: number;
        /** The value of "exclusiveMinimum" MUST be a number, representing an exclusive lower limit for a numeric instance.
         * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) "exclusiveMinimum". */
        exclusiveMinimum?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword. */
        maxLength?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword. 
         * Omitting this keyword has the same behavior as a value of 0. */
        minLength?: number;
        /** The value of this keyword MUST be a string. This string SHOULD be a valid regular expression, according to the ECMA-262 Edition 5.1 regular expression dialect.
         * A string instance is considered valid if the regular expression matches the instance successfully. Recall: regular expressions are not implicitly anchored. */
        pattern?: string;
        /** The value of this keyword MUST be a non-negative integer.
         * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword. */
        maxItems?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword.
         * Omitting this keyword has the same behavior as a value of 0. */
        minItems?: number;
        /** The value of this keyword MUST be a boolean.
         * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
         * Omitting this keyword has the same behavior as a value of false. */
        uniqueItems?: boolean;
        /** The value of this keyword MUST be a non-negative integer.
         * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword. */
        maxProperties?: number;
        /** The value of this keyword MUST be a non-negative integer.
         * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword.
         * Omitting this keyword has the same behavior as a value of 0. */
        minProperties?: number;
        /** The value of this keyword MUST be an array. Elements of this array, if any, MUST be strings, and MUST be unique.
         * An object instance is valid against this keyword if every item in the array is the name of a property in the instance.
         * Omitting this keyword has the same behavior as an empty array. */
        required?: string[];
        enum?: any[];
        // The following properties are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification.
        /** Value MUST be a string. Multiple types via an array are not supported. */
        type?: "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";
        /** Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. */
        allOf?: (Schema | Reference)[];
        /** Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. */
        oneOf?: (Schema | Reference)[];
        /** Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. */
        anyOf?: (Schema | Reference)[];
        /** Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. */
        not?: (Schema | Reference)[];
        /** Value MUST be an object and not an array. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. items MUST be present if the type is array. */
        items?: Schema | Reference;
        /** Property definitions MUST be a Schema Object and not a standard JSON Schema (inline or referenced). */
        properties?: { [name: string]: Schema | Reference };
        /** Value can be boolean or object. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. Consistent with JSON Schema, additionalProperties defaults to true. */
        additionalProperties?: boolean | Schema | Reference;
        /** CommonMark syntax MAY be used for rich text representation. */
        description?: string;
        /** See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats. */
        format?: "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";
        /** The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided.
         * Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level.
         * For example, if type is string, then default can be "foo" but cannot be 1. */
        default?: any;
        // Additional fields
        /** A true value adds "null" to the allowed type specified by the type keyword, only if type is explicitly defined within the same Schema Object.
         * Other Schema Object constraints retain their defined behavior, and therefore may disallow the use of null as a value.
         * A false value leaves the specified or default type unmodified. The default value is false. */
        nullable?: boolean;
        /** Adds support for polymorphism. The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description.
         * See [Composition and Inheritance](https://swagger.io/specification/#schema-composition) for more details. */
        discriminator?: Discriminator;
        /** Relevant only for Schema "properties" definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request.
         * If the property is marked as readOnly being true and is in the required list, the required will take effect on the response only. A property MUST NOT be marked as both readOnly and writeOnly being true.
         * Default value is false. */
        readOnly?: boolean;
        /** Relevant only for Schema "properties" definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response.
         * If the property is marked as writeOnly being true and is in the required list, the required will take effect on the request only. A property MUST NOT be marked as both readOnly and writeOnly being true.
         * Default value is false. */
        writeOnly?: boolean;
        /** This MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property. */
        xml?: Xml;
        /** Additional external documentation for this schema. */
        externalDocs?: ExternalDocumentation;
        /** A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML,
         * a string value can be used to contain the example with escaping where necessary. */
        example?: any;
        /** Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is false. */
        deprecated?: boolean;
    }


    export interface SecuritySchemeBasic {
        type: "apiKey" | "http" | "oauth2" | "openIdConnect";
        description?: string;
    }


    export interface SecuritySchemeApiKey extends SecuritySchemeBasic {
        type: "apiKey";
        name: string;
        in: "cookie" | "header" | "query";
    }


    export interface SecuritySchemeHttp extends SecuritySchemeBasic {
        type: "http";
        bearerFormat?: string;
        scheme: string;
    }


    export interface SecuritySchemeOauth2 extends SecuritySchemeBasic {
        type: "oauth2";
        flows: OAuthFlows;
    }


    export interface SecuritySchemeOpenIdConnection extends SecuritySchemeBasic {
        type: "openIdConnect";
        openIdConnectUrl: string;
    }


    export type SecurityScheme = SecuritySchemeApiKey | SecuritySchemeHttp | SecuritySchemeOauth2 | SecuritySchemeOpenIdConnection;


    export interface OAuthFlows {
        implicit?: OAuthFlow;
        password?: OAuthFlow;
        clientCredentials?: OAuthFlow;
        authorizationCode?: OAuthFlow;
    }


    export interface OAuthFlow {
        authorizationUrl?: string;
        tokenUrl?: string;
        refreshUrl?: string;
        scopes?: { [scopeName: string]: string };
    }


    export interface SecurityRequirement {
        [securitySchema: string]: string[];
    }


    export interface Server {
        url: string;
        description?: string;
        variables?: { [variable: string]: ServerVariable };
    }


    export interface ServerVariable {
        default: string;
        enum?: string[];
        description?: string;
    }


    export interface Tag {
        name: string;
        description?: string;
        externalDocs?: ExternalDocumentation;
    }


    /** A metadata object that allows for more fine-tuned XML model definitions.
     * When using arrays, XML element names are not inferred (for singular/plural forms) and the name property SHOULD be used to add that information. See examples for expected behavior.
     */
    export interface Xml {
        /** Replaces the name of the element/attribute used for the described schema property. When defined within items, it will affect the name of the individual XML elements within the list.
         * When defined alongside type being array (outside the items), it will affect the wrapping element and only if wrapped is true. If wrapped is false, it will be ignored. */
        name?: string;
        /** The URI of the namespace definition. Value MUST be in the form of an absolute URI. */
        namespace?: string;
        /** The prefix to be used for the name. */
        prefix?: string;
        /** Declares whether the property definition translates to an attribute instead of an element. Default value is false. */
        attribute?: boolean;
        /** MAY be used only for an array definition. Signifies whether the array is wrapped (for example, <books><book/><book/></books>) or unwrapped (<book/><book/>).
         * Default value is false. The definition takes effect only when defined alongside type being array (outside the items). */
        wrapped?: boolean;
    }

}