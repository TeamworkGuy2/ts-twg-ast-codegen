
/** Helper functions for transforming DtoPropertyTemplate and DtoProperty objects
 * @author TeamworkGuy2
 * @since 2016-05-14
 */
module DtoPropertyConverter {

    /** Convert a DtoPropertyTemplate object to a DtoProperty using TypeConverter and the modifier functions passed into this function
     */
    export function parseAndConvertTemplate(propName: string, propTemplate: DtoPropertyTemplate, typeConverter: TypeTemplateParser, serverTypeConverter: TypeTemplateParser,
            serverPropNamer?: (propName: string, prop: DtoPropertyTemplate) => string, propModifier?: (prop: DtoProperty) => void): DtoProperty {
        var src = propTemplate;
        var srcType = typeConverter(src.type);
        var srcAutoGen = src.autoGenerate != null ? src.autoGenerate : false;
        var srcPrimaryKey = src.primaryKey != null ? src.primaryKey : false;
        var srcReadOnly = src.readOnly != null ? src.readOnly : false;
        var srcRequired = src.required != null ? src.required : true;
        var srcServer = src.server || <typeof src.server>{};

        var resProp: DtoProperty = {
            autoGenerate: srcAutoGen,
            //defaultValue: src.defaultValue,
            primaryKey: srcPrimaryKey,
            readOnly: srcReadOnly,
            required: srcRequired,
            server: {
                autoGenerate: srcServer.autoGenerate != null ? srcServer.autoGenerate : srcAutoGen,
                //defaultValue: srcServer.defaultValue !== undefined ? srcServer.defaultValue : src.defaultValue,
                name: srcServer.name != null ? srcServer.name : (serverPropNamer != null ? serverPropNamer(propName, src) : propName),
                primaryKey: srcServer.primaryKey != null ? srcServer.primaryKey : srcPrimaryKey,
                readOnly: srcServer.readOnly != null ? srcServer.readOnly : srcReadOnly,
                required: srcServer.required != null ? srcServer.required : srcRequired,
                toLocal: srcServer.toLocal != null ? srcServer.toLocal : null,
                type: typeof srcServer.type === "string"
                    ? serverTypeConverter(<string>srcServer.type)
                    : (srcServer.type != null ? <CodeAst.Type>srcServer.type : typeof src.type === "string" ? serverTypeConverter(<string>src.type) : <CodeAst.Type>src.type),
            },
            type: srcType,
            toLocal: src.toLocal,
            toService: src.toService,
        };
        if (Object.prototype.hasOwnProperty.call(src, "defaultValue")) { resProp.defaultValue = src.defaultValue; }
        if (Object.prototype.hasOwnProperty.call(srcServer, "defaultValue")) { resProp.server.defaultValue = srcServer.defaultValue; }
        else if (Object.prototype.hasOwnProperty.call(src, "defaultValue")) { resProp.server.defaultValue = src.defaultValue; }

        if (propModifier != null) {
            propModifier(resProp);
        }

        return resProp;
    }


    /** Given a map of DtoPropertyTemplate objects, convert them to DtoProperty objects using TypeConverter and the modifier functions passed into this function
     * @param srcProps the map of DtoProperty objects to convert
     * @param typeConverter for converting 'DtoPropertyTemplate.type'
     * @param serverTypeConverter for converting 'DtoPropertyTemplate.server.type'
     * @param [serverPropNamer] an optional function to transform 'DtoPropertyTemplate.server.name' strings given a 'DtoPropertyTemplate.name'
     * @param [propModifier] an optional function to modifier the parsed/converted properties (short cut so calling code doesn't having to loop through the returned map to make small changes)
     */
    export function parseAndConvertTemplateMap(srcProps: DtoPropertyTemplateMap, typeConverter: TypeTemplateParser, serverTypeConverter: TypeTemplateParser,
        serverPropNamer?: (propName: string, prop: DtoPropertyTemplate) => string, propModifier?: (prop: DtoProperty) => void): DtoPropertyMap {

        var resProps: { [id: string]: DtoProperty } = {};

        var keys = Object.keys(srcProps);

        for (var i = 0, size = keys.length; i < size; i++) {
            var key = keys[i];
            var resProp = parseAndConvertTemplate(key, srcProps[key], typeConverter, serverTypeConverter, serverPropNamer, propModifier);
            resProps[key] = resProp;
        }

        return resProps;
    }

}

export = DtoPropertyConverter;