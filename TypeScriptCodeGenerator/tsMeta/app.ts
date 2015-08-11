/// <reference path="./definitions/tsmeta.d.ts" />
"use strict";
import DefaultPrettyPrinter = require("./whitespace/DefaultPrettyPrinter");
import DefaultGenTools = require("./templates/generators/DefaultGenTools");
import CsServicesModel = require("./templates/generators/c-sharp/CsServiceModel");
import CsToSource = require("./templates/generators/c-sharp/CsToSource");
import ReadFile = require("./file-io/ReadFile");
import WriteFile = require("./file-io/WriteFile");
import VsProjManipulator = require("./file-io/vsproj/VsProjManipulator");

/** The root of the app for both web apps (.html pages and node.js cli)
 */
class App {
    private static spaceChar = ' '.charCodeAt(0);
    private static tabChar = '\t'.charCodeAt(0);


    public static generateClass(el: HTMLElement) {
        var genTools = DefaultGenTools.newInst(DefaultPrettyPrinter.newInst("    ", 0));

        var csClass = CsServicesModel.generateServiceNamespaceSource(genTools, "CorningstoneApp", "TestingClass", [
            {
                name: "Id",
                typeName: "string"
            }, {
                name: "bebo",
                typeName: "decimal",
                required: false
            }
        ], ["For example a copyright notice."], "Author Name");

        var lines: string[] = [];

        console.log("C# class object: ", csClass);

        CsToSource.namespaceClassToLines(genTools, "CorningstoneApp", csClass, true, lines);

        console.log("lines: ", lines);

        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];

            App.appendLineWithLiteralLeadingWhitespace(el, line);

            // append newline
            var newlineElem = document.createElement("br");
            el.appendChild(newlineElem);
        }
    }


    public static appendLineWithLiteralLeadingWhitespace(el: Element, line: string) {
        var spaceCh = App.spaceChar;
        var tabCh = App.tabChar;

        var whitespaceStr = "";
        // count the number of whitespaces at the beginning of the string
        var whitespaceCount = 0;
        for (var ii = 0, sizeI = line.length; ii < sizeI; ii++) {
            var ch = line.charCodeAt(ii);
            if (ch === spaceCh || ch === tabCh) {
                whitespaceCount++;
                if (ch === spaceCh) {
                    whitespaceStr += "&nbsp;";
                }
                else if (ch === tabCh) {
                    whitespaceStr += "&nbsp;&nbsp;&nbsp;&nbsp;";
                }
            }
            else {
                break;
            }
        }

        // append whitespace
        var whitespaceElem = document.createElement("span");
        whitespaceElem.innerHTML = whitespaceStr;
        el.appendChild(whitespaceElem);
        // append source code
        var textElem = document.createElement("span");
        textElem.textContent = line.substr(whitespaceCount);
        el.appendChild(textElem);
    }


    public static main(el: HTMLElement, gutil?) {
        //App.generateClass(el);
        var projectDir = "C:\\Users\\TeamworkGuy2\\Documents\\Visual Studio 2015\\Projects\\HDSTeamBuilding\\HDSTeamBuilding\\CorningstoneApp\\";
        var csProjFile = projectDir + "CorningstoneApp.csproj";
        var webConfigFile = projectDir + "Web.config";

        gutil.log("==== File content ====");

        var projManipulator = new VsProjManipulator(csProjFile, webConfigFile);
        //projManipulator.addServiceNamespace("CorningstoneApp", "Services.Impl.ExampleTest", "Services.IExampleTest", "itlm/ExampleTest.svc");

        gutil.log("proj file sections: ", (projManipulator.getProjFileSections()["Compile"]));
        gutil.log("web config file sections: ", (projManipulator.getWebConfigFileSections()["serviceActivations"]));
        gutil.log("web config file sections: ", (projManipulator.getWebConfigFileSections()["services"]));

        projManipulator.saveProjectFiles(projectDir + "CorningstoneApp.csproj.test", projectDir + "Web.config.test");
    }


    public static logObject(log: LogFunc, obj: any) {
        var indent = "\t";
        var props = Object.keys(obj);
        log("{");
        for (var i = 0, size = props.length; i < size; i++) {
            log(indent + props[i] + ": " + obj[props[i]]);
        }
        log("}");
    }

}


if (false) {
    window.onload = () => {
        var el = document.getElementById('content');
        App.main(el);
    };
}


export = App;
