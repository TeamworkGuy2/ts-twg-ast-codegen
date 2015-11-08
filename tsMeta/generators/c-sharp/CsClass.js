"use strict";
var CsClass;
(function (CsClass) {
    function copyShallow(csClass) {
        return {
            classStart: csClass.classStart,
            fields: csClass.fields,
            classConstructors: csClass.classConstructors,
            properties: csClass.properties,
            instanceMethods: csClass.instanceMethods,
            staticMethods: csClass.staticMethods,
        };
    }
    CsClass.copyShallow = copyShallow;
})(CsClass || (CsClass = {}));
module.exports = CsClass;
