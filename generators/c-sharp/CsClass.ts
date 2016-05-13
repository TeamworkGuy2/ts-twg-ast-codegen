"use strict";

module CsClass {

    export function copyShallow(csClass: CsSource.ClassWithImportExport): CsSource.ClassMeta {
        return {
            classStart: csClass.classStart,
            fields: csClass.fields,
            classConstructors: csClass.classConstructors,
            properties: csClass.properties,
            instanceMethods: csClass.instanceMethods,
            staticMethods: csClass.staticMethods,
        };
    }

}

export = CsClass;
