"use strict";
import ArrayUtil = require("../../../utils/ArrayUtil");
import StringArray = require("../../../strings/StringArray");
import EmptyLine = require("../../../whitespace/EmptyLine");
import CsServiceModel = require("./CsServiceModel");

/** For generating the source code string array tree for a C# class from a class meta-data representation (e.g. {@link CsClassSource})
 * @since 2015-8-9
 */
class CsToSource {

    public static namespaceClassToLines(genTools: GenTools, namespaceName: string, csNsClasses: CsNamespaceSource, includeWhitespace: boolean, dst: string[]): string[] {
        if (includeWhitespace) {
            CsToSource.namespaceClassToLinesWithWhitespace(genTools, namespaceName, csNsClasses, dst);
            return;
        }

        var classesObj = {
            classImports: csNsClasses.classImports,
            namespaceStart: csNsClasses.namespaceStart,
            classes: [],
            namespaceEnd: csNsClasses.namespaceEnd
        };

        genTools.indent(1);
        classesObj.classes = CsToSource.classesToSource(genTools, csNsClasses.classes, []);
        genTools.deindent(1);

        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    }


    public static namespaceClassToLinesWithWhitespace(genTools: GenTools, namespaceName: string, csNsClasses: CsNamespaceSource, dst: string[]): string[]{
        var classesObj = {
            classImports: csNsClasses.classImports,
            ciToNsSWs: [""],
            namespaceStart: csNsClasses.namespaceStart,
            nsToCsWs: [""],
            classes: [],
            csToToNsEWs: [""],
            namespaceEnd: csNsClasses.namespaceEnd,
            nseToEdWs: [""]
        };

        genTools.indent(1);
        CsToSource.classesToSource(genTools, csNsClasses.classes, classesObj.classes);
        genTools.deindent(1);

        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    }



    public static classToLines(genTools: GenTools, namespaceName: string, csClasses: CsClassWithImportExportSource[], includeWhitespace: boolean, dst: string[]): string[] {
        if (includeWhitespace) {
            CsToSource.classToLinesWithWhitespace(genTools, namespaceName, csClasses, dst);
            return;
        }

        var classesObj = {
            classImports: [],
            namespaceStart: CsServiceModel.getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            classes: [],
            namespaceEnd: CsServiceModel.getDefaultServiceClassNamespaceEnd(genTools)
        };

        var methodToSourceFunc = CsToSource.createMethodToSourceMapper(genTools);

        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];

            ArrayUtil.addAll(classesObj.classImports, cls.classImports);

            classesObj.classes.push({
                classStart: cls.classStart,
                classConstructors: cls.classConstructors,
                properties: cls.properties,
                instanceMethods: cls.instanceMethods.map(methodToSourceFunc),
                staticMethods: cls.staticMethods.map(methodToSourceFunc),
            });
        }

        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    }


    public static classToLinesWithWhitespace(genTools: GenTools, namespaceName: string, csClasses: CsClassWithImportExportSource[], dst: string[]): string[] {
        var classesObj = {
            classImports: [],
            ciToNsSWs: [""],
            namespaceStart: CsServiceModel.getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            nsToCsWs: [""],
            classes: [],
            csToToNsEWs: [""],
            namespaceEnd: CsServiceModel.getDefaultServiceClassNamespaceEnd(genTools),
            nseToEdWs: [""]
        };

        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];
            ArrayUtil.addAll(classesObj.classImports, cls.classImports);
        }

        genTools.indent(1);
        CsToSource.classesToSource(genTools, csClasses, classesObj.classes);
        genTools.deindent(1);

        StringArray.toStringFromObjectsDeep(classesObj, dst);
        return dst;
    }


    private static classesToSource(genTools: GenTools, csClasses: CsClassMeta[], dstClasses: CsClassSourceLines[] = []): CsClassSourceLines[] {
        var methodToSourceFunc = CsToSource.createMethodToSourceMapper(genTools);
        var propToSourceFunc = CsToSource.createPropertyMethodToSourceMapper(genTools);

        for (var i = 0, size = csClasses.length; i < size; i++) {
            var cls = csClasses[i];
            var clsHeaderLines = CsToSource.classHeaderToMetaSource(genTools, cls.classStart);
            var fieldLines = CsToSource.fieldsToSource(genTools, cls.fields);
            var constructorLines = StringArray.stringArrayJoin(cls.classConstructors.map(methodToSourceFunc), ["", ""]);
            var propLines = StringArray.stringArrayJoin(cls.properties.map(propToSourceFunc), ["", ""]);
            var instanceMethodLines = StringArray.stringArrayJoin(cls.instanceMethods.map(methodToSourceFunc), ["", ""]);
            var staticMethodLines = StringArray.stringArrayJoin(cls.staticMethods.map(methodToSourceFunc), ["", ""]);
            var clsFooterLines = CsToSource.classFooterSource(genTools, cls.classStart);

            dstClasses.push({
                classComments: clsHeaderLines.comments,
                annotations: clsHeaderLines.annotations,
                classStart: clsHeaderLines.classStart,
                fields: EmptyLine.prePostIfAny(fieldLines, ["", ""], null, clsHeaderLines.classStart, ["", ""], null, constructorLines),
                classConstructors: EmptyLine.prePostIfAny(constructorLines, ["", ""], [""], fieldLines, ["", ""], null, propLines),
                properties: EmptyLine.prePostIfAny(propLines, null, null, constructorLines, ["", ""], ["", ""], instanceMethodLines),
                instanceMethods: EmptyLine.prePostIfAny(instanceMethodLines, null, null, propLines, ["", ""], ["", ""], staticMethodLines),
                staticMethods: EmptyLine.prePostIfAny(staticMethodLines, null, null, instanceMethodLines, ["", ""], ["", ""], clsFooterLines),
                classEnd: EmptyLine.prePostIfAny(clsFooterLines, null, null, staticMethodLines, null, null, null),
            });
        }

        return dstClasses;
    }


    public static classHeaderToMetaSource(genTools: GenTools, classHeader: CsClassHeader): { comments: string[]; annotations: string[]; classStart: string[] } {
        return {
            comments: genTools.addIndent(classHeader.comments),
            annotations: genTools.addIndent(classHeader.annotations),
            classStart: [
                genTools.getIndent() + classHeader.accessModifiers.join(" ") + " " + classHeader.className + CsToSource.genericParametersToSource(genTools, classHeader.genericParameters),
                genTools.getIndent() + "{"
            ],
        };
    }


    public static classHeaderToSource(genTools: GenTools, classHeader: CsClassHeader, dst: string[]): string[] {
        ArrayUtil.addAll(genTools.addIndent(classHeader.comments), dst);
        ArrayUtil.addAll(genTools.addIndent(classHeader.annotations), dst);
        dst.push(genTools.getIndent() + classHeader.accessModifiers.join(" ") + " " + classHeader.className + CsToSource.genericParametersToSource(genTools, classHeader.genericParameters));
        dst.push(genTools.getIndent() + "{");
        return dst;
    }


    public static classFooterSource(genTools: GenTools, classHeader: CsClassHeader, dst: string[] = []): string[] {
        dst.push(genTools.getIndent() + "}");
        return dst;
    }


    public static createMethodToSourceMapper(genTools: GenTools): (method: CsMethodSource) => string[] {
        return (method: CsMethodSource) => CsToSource.methodToSource(genTools, method, []);
    }


    public static methodToSource(genTools: GenTools, method: CsMethodSource | CsConstructorSource, dst: string[]): string[]{
        var paramStrs = (method.parameters ? method.parameters.map((prop) => {
            var propStr = prop.typeName + " " + prop.propName + (prop.required === false ? (prop.defaultValue ? " = " + prop.defaultValue : "?") : "");
            return propStr;
        }) : []);
        var signature = method.accessModifiers.join(" ") + " " + (method["returnType"] ? method["returnType"] + " " : "") + method.name + "(" + paramStrs.join(", ") + ")";

        dst.push(genTools.getIndent() + signature);

        dst.push(genTools.getIndent() + "{");
        genTools.indent(1);

        var indent = genTools.getIndent();
        for (var i = 0, size = method.code.length; i < size; i++) {
            dst.push(indent + method.code[i]);
        }

        genTools.deindent(1);
        dst.push(genTools.getIndent() + "}");

        return dst;
    }


    public static createPropertyMethodToSourceMapper(genTools: GenTools): (prop: PropertyMethodMeta) => string[]{
        return (prop: PropertyMethodMeta) => CsToSource.propertyMethodToSource(genTools, prop, []);
    }


    public static propertyMethodToSource(genTools: GenTools, prop: PropertyMethodMeta, dst: string[]): string[]{
        ArrayUtil.addAll(genTools.addIndent(prop.comments), dst);
        ArrayUtil.addAll(genTools.addIndent(prop.annotations), dst);
        var indent = genTools.getIndent();
        dst.push(indent + prop.accessModifiers.join(" ") + " " + prop.typeName + (prop.required === false ? "?" : "") + " " + prop.propName);

        dst.push(indent + "{");
        genTools.indent(1);

        dst.push(genTools.getIndent() + "get;");
        if (prop.readOnly !== true) {
            dst.push(genTools.getIndent() + "set;");
        }

        genTools.deindent(1);
        dst.push(indent + "}");

        return dst;
    }


    public static fieldsToSource(genTools: GenTools, fields: PropInfo[], dst: string[] = []): string[] {
        var indent = genTools.getIndent();
        for (var i = 0, size = fields.length; i < size; i++) {
            var field = fields[i];
            dst.push(indent + field.typeName + (field.required === false ? "?" : "") + " " + field.propName + (field["defaultValue"] ? " = " + field.defaultValue : "") + ";");
        }
        return dst;
    }


    // return in format '<A, B, C>'
    public static genericParametersToSource(genTools: GenTools, genericParameters: string[]): string {
        return (genericParameters && genericParameters.length > 0 ? "<" + genericParameters.join(", ") + ">" : "");
    }

}

export = CsToSource;
