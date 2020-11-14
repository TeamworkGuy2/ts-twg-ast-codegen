/// <reference path="./type-usage.d.ts" />

import TypeConverter = require("./TypeConverter");

module TypeTracking {

    export function isAnnotationUsage(tu: TypeUsage.Any): tu is TypeUsage.Annotation {
        return "annotation" in tu;
    }

    export function isFieldUsage(tu: TypeUsage.Any): tu is TypeUsage.Field {
        return "field" in tu;
    }

    export function isMethodParameterUsage(tu: TypeUsage.Any): tu is TypeUsage.MethodParameter {
        return "parameter" in tu;
    }

    export function isMethodReturnUsage(tu: TypeUsage.Any): tu is TypeUsage.MethodReturn {
        return "returnType" in tu;
    }

    export function isClassExtendsUsage(tu: TypeUsage.Any): tu is TypeUsage.ClassExtends {
        return "extendType" in tu;
    }

    export function isClassImplementsUsage(tu: TypeUsage.Any): tu is TypeUsage.ClassImplements {
        return "implementType" in tu;
    }


    export function typeUsageToString(typeUse: TypeUsage.Any): string {
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

}

export = TypeTracking;