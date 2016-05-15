"use strict";
var TypeConverter = require("./TypeConverter");
/** Helper functions for transforming DtoPropertyTemplate and DtoProperty objects
 * @author TeamworkGuy2
 */
var DtoPropertyConverter;
(function (DtoPropertyConverter) {
    /** Convert a DtoPropertyTemplate object to a DtoProperty using TypeConverter and the modifier functions passed into this function
     */
    function parseAndConvertTemplate(name, propTemplate, returnUnknownTypes, returnUnknownServerTypes, serverPropNamer, propModifier) {
        var src = propTemplate;
        var srcType = TypeConverter.TypeScript.parseTypeTemplate(src.type, returnUnknownTypes);
        var srcAutoGen = src.autoGenerate != null ? src.autoGenerate : false;
        var srcPrimaryKey = src.primaryKey != null ? src.primaryKey : false;
        var srcReadOnly = src.readOnly != null ? src.readOnly : false;
        var srcRequired = src.required != null ? src.required : true;
        var srcServer = src.server || {};
        var resProp = {
            autoGenerate: srcAutoGen,
            defaultValue: src.defaultValue,
            primaryKey: srcPrimaryKey,
            readOnly: srcReadOnly,
            required: srcRequired,
            server: {
                autoGenerate: srcServer.autoGenerate != null ? srcServer.autoGenerate : srcAutoGen,
                defaultValue: srcServer.defaultValue !== undefined ? srcServer.defaultValue : src.defaultValue,
                name: srcServer.name != null ? srcServer.name : (serverPropNamer != null ? serverPropNamer(name, src) : name),
                primaryKey: srcServer.primaryKey != null ? srcServer.primaryKey : srcPrimaryKey,
                readOnly: srcServer.readOnly != null ? srcServer.readOnly : srcReadOnly,
                required: srcServer.required != null ? srcServer.required : srcRequired,
                type: typeof srcServer.type === "string"
                    ? TypeConverter.parseTypeTemplate(srcServer.type)
                    : (srcServer.type != null ? srcServer.type : typeof src.type === "string" ? TypeConverter.parseTypeTemplate(src.type) : src.type),
            },
            type: srcType,
        };
        if (propModifier != null) {
            propModifier(resProp);
        }
        return resProp;
    }
    DtoPropertyConverter.parseAndConvertTemplate = parseAndConvertTemplate;
    /** Given a map of DtoPropertyTemplate objects, convert them to DtoProperty objects using TypeConverter and the modifier functions passed into this function
     * @param srcProps the map of DtoProperty objects to convert
     * @param returnUnknownTypes whether to return unknown 'DtoPropertyTemplate.type' types or throw an error
     * @param returnUnknownServerTypes whether to return unknown 'DtoPropertyTemplate.server.type' types or throw an error
     * @param [serverPropNamer] an optional function to transform 'DtoPropertyTemplate.server.name' strings given a 'DtoPropertyTemplate.name'
     * @param [propModifier] an optional function to modifier the parsed/converted properties (short cut so calling code doesn't having to loop through the returned map to make small changes)
     */
    function parseAndConvertTemplateMap(srcProps, returnUnknownTypes, returnUnknownServerTypes, serverPropNamer, propModifier) {
        var resProps = {};
        var keys = Object.keys(srcProps);
        for (var i = 0, size = keys.length; i < size; i++) {
            var key = keys[i];
            var resProp = parseAndConvertTemplate(key, srcProps[key], returnUnknownTypes, returnUnknownServerTypes, serverPropNamer, propModifier);
            resProps[key] = resProp;
        }
        return resProps;
    }
    DtoPropertyConverter.parseAndConvertTemplateMap = parseAndConvertTemplateMap;
})(DtoPropertyConverter || (DtoPropertyConverter = {}));
module.exports = DtoPropertyConverter;
