﻿import fs = require("fs");
import Q = require("q");
import Arrays = require("../../ts-mortar/utils/Arrays");
import gutil = require("gulp-util");
import WriteFile = require("./WriteFile");

/**
 * @author TeamworkGuy2
 */
module TransformFile {

    export enum MatchOperation {
        REPLACE_LINES,
        REPLACE_MATCHING_PORTION,
        DELETE_LINES,
        DELETE_MATCHING_PORTION,
        RETURN_MATCHING_LINES,
        RETURN_MATCHING_PORTIONS,
        PRINT_LINES
    }


    export interface ReplaceVar {
        op: MatchOperation;
        opParam: string | string[];
    }


    /** Split a file's contents into lines at either '\n' or '\r\n'
     * @param fileContent
     */
    export function splitFileLines(fileContent: string) {
        var lines = fileContent.split(/\n|\r\n/);
        return lines;
    }


    /** Replace '\n' with '\r\n' and replace '\t' with four spaces '    '
     * @param text
     */
    export function joinLinesForFile(text: string) {
        var res = text.replace(/\n/g, "\r\n").replace(/\t/g, "    ");
        return res;
    }


    /** Map a dictionary of variable names and strings/string arrays/replace text variables to a map of variable names and replace text variables
     * using a default 'MatchOperation' to create a replace text variable when a variable name maps to a string or string array
     */
    export function mapVarsToOps(op: MatchOperation, variableNamesToLines: { [id: string]: string | string[] | ReplaceVar }) {
        var variables: { [name: string]: ReplaceVar } = {};
        return Object.keys(variableNamesToLines).reduce((vars, k) => {
            var varData = variableNamesToLines[k];
            var isStrOrStrAry = typeof varData === "string" || Array.isArray(varData);
            vars[k] = isStrOrStrAry ? { op: op, opParam: <string | string[]>varData } : <ReplaceVar>varData;
            return vars;
        }, variables);
    }


    /** Replace lines containing a variable with lines/strings from a map of variable names to string arrays
     * TODO: use StringTemplate v3/v4 to fill in template file
     *
     * @param startMarker: the start marker before all variable names, (for example '$' default for StringTemplate)
     * @param endMarker: the end marker after all variable names, (for example '$' default for StringTemplate)
     * @param transformations: a map of
     * Each transformation is applied to the lines generated by the previous transformation, transformations occur in the {@link Object#keys()} iteration order.
     * {MatchOperation} op: the operation to perform on each matching line, such as removing it from the array of returned lines, 
     * replacing it from the {@code variableNamesToLines} or replacing just the matching variable name.
     * {String | String[]} opParam: the parameters to apply to the operation, for example {@link MatchOperation#REPLACE_LINES} takes
     * an array of lines and inserts them in place of each matching line, {@link MatchOperation#REPLACE_MATCHIN_PORTION} takes a single
     * string and replaces the matching portion of strings
     * variable names to operations and operation parameters to replace them with
     * @return an array of transformed strings
     */
    export function transformLines(fileName: string, lines: string[], startMarker: string, endMarker: string, transformations: { [name: string]: ReplaceVar }): string[] {
        startMarker = (startMarker === undefined || startMarker === null) ? "" : startMarker;
        endMarker = (endMarker === undefined || endMarker === null) ? "" : endMarker;
        var origLines = lines;
        var newLines: string[] = null;
        var variableNames = Object.keys(transformations);

        var maxLineNumDigits = lines.length.toString().length;
        // if we are only printing matching lines, we don't need array for resulting lines
        if (variableNames != null && variableNames.filter((k) => transformations[k].op === MatchOperation.PRINT_LINES).length === variableNames.length) {
            gutil.log("Matching lines in: " + fileName);
        }

        var returnNonMatching: boolean = true;
        // don't return non-matching strings if any of the transformation operations are 'return' operations
        if (variableNames != null && variableNames.filter((k) => transformations[k].op === MatchOperation.RETURN_MATCHING_LINES || transformations[k].op === MatchOperation.RETURN_MATCHING_PORTIONS).length > 0) {
            returnNonMatching = false;
        }

        // variable-by-variable
        for (var ii = 0, sizeI = variableNames.length; ii < sizeI; ii++) {
            newLines = [];
            var variableName = variableNames[ii];
            var varFullName = startMarker + variableName + endMarker;
            var op = transformations[variableName].op;
            var opParam = transformations[variableName].opParam;
            var opParamIsAry = Array.isArray(opParam);
            // line-by-line
            for (var i = 0, size = lines.length; i < size; i++) {
                // if line contains variable name, replace line with variable replacement line
                if (lines[i].indexOf(varFullName) > -1) {
                    switch (op) {
                        case MatchOperation.DELETE_LINES:
                            break;
                        case MatchOperation.PRINT_LINES:
                            gutil.log(i + ". " + lines[i]);
                            break;
                        case MatchOperation.REPLACE_LINES:
                            if (opParamIsAry) {
                                Arrays.addAll(newLines, <string[]>opParam);
                            }
                            else {
                                newLines.push(<string>opParam);
                            }
                            break;
                        case MatchOperation.DELETE_MATCHING_PORTION:
                            var resLine = lines[i].replace(varFullName, "");
                            newLines.push(resLine);
                            break;
                        case MatchOperation.REPLACE_MATCHING_PORTION:
                            if (opParamIsAry) {
                                var resLine = lines[i].replace(varFullName, <string>opParam[0]);
                                newLines.push(resLine);
                                if (opParam.length > 1) {
                                    Arrays.addAll(newLines, (<string[]>opParam).slice(1));
                                }
                            }
                            else {
                                var resLine = lines[i].replace(varFullName, <string>opParam);
                                newLines.push(resLine);
                            }
                            break;
                        case MatchOperation.RETURN_MATCHING_PORTIONS:
                            var matchStr = varFullName;
                        case MatchOperation.RETURN_MATCHING_LINES:
                            var matchStr = lines[i];
                            newLines.push(matchStr);
                            break;
                        default:
                            newLines.push(lines[i]);
                            break;
                    }
                }
                else {
                    if (returnNonMatching) {
                        newLines.push(lines[i]);
                    }
                }
            }
            // apply the next transformation to the lines generated by the last transformation
            lines = newLines;
        }
        return newLines || [];
    }


    export function transformFile(srcFile: string, startVarMark: string, endVarMark: string, transformations: { [id: string]: ReplaceVar }): string[] {
        var fileSrc = fs.readFileSync(srcFile);
        var fileLines = splitFileLines(fileSrc.toString());
        var lines = transformLines(srcFile, fileLines, startVarMark, endVarMark, transformations);
        return lines;
    }


    /** Transform a file's contents and return the original and resulting lines to a callback function
     */
    function transformFileToLines(matchOp: MatchOperation, srcFile: string, startVarMark: string, endVarMark: string,
            variablesNamesToLines: { [id: string]: string | string[] | ReplaceVar }): { srcLines: string[]; transformedLines: string[]; } {

        var buf = fs.readFileSync(srcFile);
        var srcLines = splitFileLines(buf.toString());
        var transformedLines = transformLines(srcFile, srcLines, startVarMark, endVarMark, mapVarsToOps(matchOp, variablesNamesToLines));
        return {
            srcLines,
            transformedLines
        };
    }


    /** Transform a file's contents and write it to a destination file
     * @return a message about the text written to the file
     */
    export function transformFileToFile(matchOp: MatchOperation, srcFile: string, dstFile: string, startVarMark: string, endVarMark: string,
            variablesNamesToLines: { [id: string]: string | string[] | ReplaceVar }) {

        var res = transformFileToLines(matchOp, srcFile, startVarMark, endVarMark, variablesNamesToLines);
        WriteFile.writeFileLines(dstFile, res.transformedLines);
        return res;
    }


    export function transformFileToFileAsync(matchOp: MatchOperation, srcFile: string, dstFile: string, startVarMark: string, endVarMark: string,
            variablesNamesToLines: { [id: string]: string | string[] | ReplaceVar }, doneCb: (res: { srcLines: string[]; transformedLines: string[]; }) => void, errorCb: (errMsg: string) => void,
            postFileWritten?: (fileName: string, successCb: () => void, errorCb: (err) => void) => void) {

        var resLns = transformFileToLines(matchOp, srcFile, startVarMark, endVarMark, variablesNamesToLines);
        WriteFile.writeFileLinesAsync(dstFile, resLns.transformedLines, function (res) {
            doneCb(resLns);
        }, errorCb, postFileWritten);
    }


    /** Transform a file containing template variables
     * @param srcFile: the source file containing text to read
     * @param dstFile: the destination file to write the transformed text to
     * @param variablesNamesToLines: associates template variable names with the text to insert in their place
     * @param postFileWritten: a callback to call after writing the destination file
     * @param successMsg: a success message to pass to the resolved returned promise
     */
    export function convertTemplateFile(srcFile: string, dstFile: string, variablesNamesToLines: { [id: string]: string | string[] }, delimiterStart: string = "$", delimiterEnd: string = "$") {
        var msg = transformFileToFile(MatchOperation.REPLACE_MATCHING_PORTION, srcFile, dstFile, delimiterStart, delimiterEnd, variablesNamesToLines);
        return msg;
    }


    export function convertTemplateFileAsync(srcFile: string, dstFile: string, variablesNamesToLines: { [id: string]: string | string[] },
            postFileWritten?: (fileName: string, successCb: () => void, errorCb: (err) => void) => void, successMsg?: string,
            delimiterStart: string = "$", delimiterEnd: string = "$") {
        var dfd = Q.defer<string>();

        transformFileToFileAsync(MatchOperation.REPLACE_MATCHING_PORTION, srcFile, dstFile, delimiterStart, delimiterEnd, variablesNamesToLines, function (msg) {
            dfd.resolve((successMsg ? successMsg + ": " : "") + msg);
        }, function (err) {
            dfd.reject(err);
        }, postFileWritten);

        return dfd.promise;
    }

}

export = TransformFile;