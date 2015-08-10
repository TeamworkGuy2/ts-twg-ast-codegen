"use strict";
var CsClass;
(function (CsClass) {
    function toCsClassSource(csClass) {
        return {
            classStart: csClass.classStart,
            fields: csClass.fields,
            classConstructors: csClass.classConstructors,
            properties: csClass.properties,
            instanceMethods: csClass.instanceMethods,
            staticMethods: csClass.staticMethods,
        };
    }
    CsClass.toCsClassSource = toCsClassSource;
})(CsClass || (CsClass = {}));
module.exports = CsClass;
