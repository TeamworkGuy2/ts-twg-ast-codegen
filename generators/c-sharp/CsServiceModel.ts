"use strict";
import StringArray = require("../../strings/StringArray");
import Modifier = require("../../code-types/modifiers/Modifier");
import CsClass = require("./CsClass");

/**
 * @since 2015-8-8
 */
module CsServiceModel {

    export function getDefaultServiceClassImports(genTools: GenTools): string[] {
        return genTools.indent([
            "using System.Runtime.Serialization;",
            "using System;"
        ]);
    }


    export function getDefaultServiceClassNamespaceStart(genTools: GenTools, namespaceName: string): string[] {
        return [
            "namespace " + namespaceName,
            "{"
        ];
    }


    export function getDefaultServiceClassNamespaceEnd(genTools: GenTools): string[] {
        return ["}"];
    }


    export function generateServiceClass(genTools: GenTools, className: string, props: NamedProperty[], copyrightLines?: string[], authorName?: string): CsClassWithImportExportSource {

        var classComments = [
            "/// <summary>",
            "/// <para>",
            "/// An entity class that represents a " + className + ".",
            "/// </para>",
            "/// </summary>",
            "/// <threadsafety>This class is mutable, so it is not thread-safe.</threadsafety>",
        ];
        if (authorName) {
            classComments.push("/// <author>" + authorName + "</author>");
        }
        classComments.push("/// <version>1.0</version>");
        if (copyrightLines) {
            if (copyrightLines.length === 1) {
                classComments.push("/// <copyright>" + copyrightLines + "</copyright>");
            }
            else {
                StringArray.preAppendArray(
                    "/// <copyright>",
                    StringArray.preAppend("/// ", null, copyrightLines, classComments),
                    "/// </copyright>");
            }
        }

        var classStart: CsClassHeader = {
            accessModifiers: Modifier.publicClass(),
            annotations: ["[DataContract]"],
            className: className,
        };

        var classConstructors: CsConstructorSource[] = [{
            comments: [
                "/// <summary>",
                "/// <para>",
                "/// Initializes a new instance of the <see cref=\"" + className + "\"/> class.",
                "/// </para>",
                "/// </summary>"
            ],
            accessModifiers: ["public"],
            name: className,
            code: []
        }];

        var properties: PropertyMethodMeta[] = [];
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = props[i];
            var propLines: PropertyMethodMeta = {
                readOnly: prop.readOnly,
                required: prop.required,
                accessModifiers: ["public"],
                propName: prop.name,
                type: prop.type
            };
            properties.push(propLines);
        }

        return {
            classImports: getDefaultServiceClassImports(genTools),
            classStart: classStart,
            fields: [],
            classConstructors: classConstructors,
            properties: properties,
            instanceMethods: [],
            staticMethods: [],
        };
    }


    export function generateServiceNamespaceSrc(genTools: GenTools, namespaceName: string, className: string, props: NamedProperty[], copyrightLines?: string[], authorName?: string): CsNamespaceSource {
        var classObj = generateServiceClass(genTools, className, props, copyrightLines, authorName);
        var importStrs: string[] = classObj.classImports;

        return {
            classImports: importStrs,
            namespaceStart: getDefaultServiceClassNamespaceStart(genTools, namespaceName),
            classes: [CsClass.copyShallow(classObj)],
            namespaceEnd: getDefaultServiceClassNamespaceEnd(genTools)
        };
    }

}

export = CsServiceModel;
