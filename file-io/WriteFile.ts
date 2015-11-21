"use strict";
import Arrays = require("../lib/ts-mortar/utils/Arrays");
import fs = require("fs");

/**
 * @since 2015-8-10
 */
module WriteFile {

    export function writeFile(filePath: string, lines: string[]): void {
        fs.writeFileSync(filePath, lines.join('\n'));
    }


    export function writeFileSections(filePath: string, linesSections: { [sectionName: string]: string[] }): void {
        var allLines = [];
        var props = Object.keys(linesSections);
        for (var i = 0, size = props.length; i < size; i++) {
            Arrays.addAll(allLines, linesSections[props[i]]);
        }

        writeFile(filePath, allLines);
    }


    /** Replace '\n' with '\r\n' and replace '\t' with four spaces '    '
     * @param text
     */
    export function joinLinesForFile(text: string) {
        var res = text.replace(/\n/g, "\r\n").replace(/\t/g, "    ");
        return res;
    }


    export function writeFileLines(fileName: string, srcLines: string[]): void {
        var text = srcLines.join("\n");
        text = joinLinesForFile(text);

        fs.writeFileSync(fileName, text);
    }


    export function writeFileLinesAsync(fileName: string, srcLines: string[], doneCb: (msg: string) => void, errorCb: (errMsg: string) => void,
        postFileWritten?: (fileName: string, successCb: () => void, errorCb: (err) => void) => void): void {
        var text = srcLines.join("\n");
        text = joinLinesForFile(text);

        fs.writeFile(fileName, text, function (writeErr) {
            if (writeErr) {
                errorCb("error writing generated '" + fileName + "': " + writeErr);
                return;
            }

            if (postFileWritten) {
                postFileWritten(fileName, function () {
                    doneCb("'" + fileName + "' " + srcLines.length + " lines");
                }, function (compileErr) {
                    errorCb("error writing file '" + fileName + "': " + compileErr);
                });
            }
            else {
                doneCb("'" + fileName + "' " + srcLines.length + " lines");
            }
        });
    }

}

export = WriteFile;
