"use strict";
var StringArray = require("../../../strings/StringArray");
var CsClass = require("./CsClass");
/**
 * @since 2015-8-8
 */
var CsServiceClass;
(function (CsServiceClass) {
    function getDefaultServiceClassImports() {
        return [
            "using System.Runtime.Serialization;",
            "using System;"
        ];
    }
    CsServiceClass.getDefaultServiceClassImports = getDefaultServiceClassImports;
    function getDefaultServiceClassNamespaceStart(namespaceName) {
        return [
            "namespace " + namespaceName,
            "{"
        ];
    }
    CsServiceClass.getDefaultServiceClassNamespaceStart = getDefaultServiceClassNamespaceStart;
    function getDefaultServiceClassNamespaceEnd() {
        return ["}"];
    }
    CsServiceClass.getDefaultServiceClassNamespaceEnd = getDefaultServiceClassNamespaceEnd;
    function generateServiceClass(className, props, copyrightLines, authorName) {
        var classComments = [
            "    /// <summary>",
            "    /// <para>",
            "    /// An entity class that represents a " + className + ".",
            "    /// </para>",
            "    /// </summary>",
            "    /// <threadsafety>This class is mutable, so it is not thread-safe.</threadsafety>",
        ];
        if (authorName) {
            classComments.push("    /// <author>" + authorName + "</author>");
        }
        classComments.push("    /// <version>1.0</version>");
        if (copyrightLines) {
            if (copyrightLines.length === 1) {
                classComments.push("    /// <copyright>" + copyrightLines + "</copyright>");
            }
            else {
                StringArray.concatCommonPreSuffix("    /// ", null, "<copyright>", copyrightLines, "</copyright>", classComments);
            }
        }
        var classStart = [
            "    [DataContract]",
            "    public class " + className,
            "    {"
        ];
        var classConstructors = [[
            "        /// <summary>",
            "        /// <para>",
            "        /// Initializes a new instance of the <see cref=\"" + className + "\"/> class.",
            "        /// </para>",
            "        /// </summary>",
            "        public " + className + "()",
            "        {",
            "        }"
        ]];
        var properties = {};
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = props[i];
            var propLines = [
                "        /// <value>property description.</value>",
                "        [DataMember]",
                "        public " + prop.typeName + (prop.required === false ? "?" : "") + " " + prop.name,
                "        {",
                "            get;",
            ];
            if (prop.readOnly !== true) {
                propLines.push("            set;");
            }
            propLines.push("        }");
            properties[prop.name] = propLines;
        }
        return {
            classImports: CsServiceClass.getDefaultServiceClassImports(),
            classComments: classComments,
            classStart: classStart,
            classConstructors: classConstructors,
            properties: properties,
            instanceMethods: [],
            staticMethods: [],
            classEnd: ["    }"]
        };
    }
    CsServiceClass.generateServiceClass = generateServiceClass;
    function generateServiceNamespace(namespaceName, className, props, copyrightLines, authorName) {
        var classObj = CsServiceClass.generateServiceClass(className, props, copyrightLines, authorName);
        var importStrs = classObj.classImports;
        return {
            classImports: importStrs,
            namespaceStart: CsServiceClass.getDefaultServiceClassNamespaceStart(namespaceName),
            classes: [CsClass.toCsClassSource(classObj)],
            namespaceEnd: CsServiceClass.getDefaultServiceClassNamespaceEnd()
        };
    }
    CsServiceClass.generateServiceNamespace = generateServiceNamespace;
})(CsServiceClass || (CsServiceClass = {}));
module.exports = CsServiceClass;
