"use strict";
var Arrays = require("../../ts-mortar/utils/Arrays");
var fs = require("fs");
/**
 * @since 2015-8-10
 */
var WriteFile;
(function (WriteFile) {
    function writeFile(filePath, lines) {
        fs.writeFileSync(filePath, lines.join('\n'));
    }
    WriteFile.writeFile = writeFile;
    function writeFileSections(filePath, linesSections) {
        var allLines = [];
        var props = Object.keys(linesSections);
        for (var i = 0, size = props.length; i < size; i++) {
            Arrays.addAll(allLines, linesSections[props[i]]);
        }
        writeFile(filePath, allLines);
    }
    WriteFile.writeFileSections = writeFileSections;
    /** Replace '\n' with '\r\n' and replace '\t' with four spaces '    '
     * @param text
     */
    function joinLinesForFile(text) {
        var res = text.replace(/\n/g, "\r\n").replace(/\t/g, "    ");
        return res;
    }
    WriteFile.joinLinesForFile = joinLinesForFile;
    function writeFileLines(fileName, srcLines) {
        var text = srcLines.join("\n");
        text = joinLinesForFile(text);
        fs.writeFileSync(fileName, text);
    }
    WriteFile.writeFileLines = writeFileLines;
    function writeFileLinesAsync(fileName, srcLines, doneCb, errorCb, postFileWritten) {
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
    WriteFile.writeFileLinesAsync = writeFileLinesAsync;
})(WriteFile || (WriteFile = {}));
module.exports = WriteFile;
