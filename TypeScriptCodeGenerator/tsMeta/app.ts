/// <reference path="./definitions/tsmeta.d.ts" />
"use strict";
import DefaultPrettyPrinter = require("./whitespace/DefaultPrettyPrinter");
import DefaultGenTools = require("./templates/generators/DefaultGenTools");
import CsServicesModel = require("./templates/generators/c-sharp/CsServiceModel");
import CsToSource = require("./templates/generators/c-sharp/CsToSource");

class App {
    private static spaceChar = ' '.charCodeAt(0);
    private static tabChar = '\t'.charCodeAt(0);

    public static main(el: HTMLElement) {
        var spaceCh = App.spaceChar;
        var tabCh = App.tabChar;
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
            // append newline
            var newlineElem = document.createElement("br");
            el.appendChild(newlineElem);
        }

    }

}

window.onload = () => {
    var el = document.getElementById('content');
    App.main(el);
};
