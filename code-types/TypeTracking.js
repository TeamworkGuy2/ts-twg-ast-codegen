"use strict";
/// <reference path="./type-usage.d.ts" />
var TypeConverter = require("./TypeConverter");
var TypeTracking;
(function (TypeTracking) {
    function isAnnotationUsage(tu) {
        return "annotation" in tu;
    }
    TypeTracking.isAnnotationUsage = isAnnotationUsage;
    function isFieldUsage(tu) {
        return "field" in tu;
    }
    TypeTracking.isFieldUsage = isFieldUsage;
    function isMethodParameterUsage(tu) {
        return "parameter" in tu;
    }
    TypeTracking.isMethodParameterUsage = isMethodParameterUsage;
    function isMethodReturnUsage(tu) {
        return "returnType" in tu;
    }
    TypeTracking.isMethodReturnUsage = isMethodReturnUsage;
    function isClassExtendsUsage(tu) {
        return "extendType" in tu;
    }
    TypeTracking.isClassExtendsUsage = isClassExtendsUsage;
    function isClassImplementsUsage(tu) {
        return "implementType" in tu;
    }
    TypeTracking.isClassImplementsUsage = isClassImplementsUsage;
    function typeUsageToString(typeUse) {
        if (isAnnotationUsage(typeUse)) {
            return "annotation '" + typeUse.annotation.name + "' on " + typeUse.class.classSignature.name;
        }
        else if (isFieldUsage(typeUse)) {
            return "field '" + typeUse.field.name + "' of " + typeUse.class.classSignature.name;
        }
        else if (isMethodParameterUsage(typeUse)) {
            return "method parameter '" + typeUse.parameter.name + "' of " + typeUse.class.classSignature.name + "." + typeUse.method.name + "()";
        }
        else if (isMethodReturnUsage(typeUse)) {
            return "method return type '" + TypeConverter.typeToString(typeUse.returnType) + "' of " + typeUse.class.classSignature.name + "." + typeUse.method.name + "()";
        }
        else if (isClassExtendsUsage(typeUse)) {
            return "class " + typeUse.class.classSignature.name + " extends " + typeUse.extendType;
        }
        else if (isClassImplementsUsage(typeUse)) {
            return "class " + typeUse.class.classSignature.name + " implements " + typeUse.implementType;
        }
        else {
            throw new Error("unknown TypeUsage type shape: { " + Object.keys(typeUse).join(": ...; ") + " }");
        }
    }
    TypeTracking.typeUsageToString = typeUsageToString;
})(TypeTracking || (TypeTracking = {}));
module.exports = TypeTracking;
