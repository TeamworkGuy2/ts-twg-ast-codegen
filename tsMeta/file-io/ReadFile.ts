"use strict";
import StringUtil = require("../utils/StringUtil");

import fs = require("fs");


/**
 * @since 2015-8-10
 */
module ReadFile {

    export function readLines(filePath: string): string[]{
        var content = fs.readFileSync(filePath, null).toString();
        var lines = content.split('\n');
        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            if (line.charAt(line.length - 1) === '\r') {
                lines[i] = line.substr(0, line.length - 1);
            }
        }
        return lines;
    }


    // split a set of lines into a matching section and the lines that come before and after that section
    export function readLinesSection(lines: string[], sectionStartLine: string, sectionEndLine: string, includeStartEndLinesInSection: boolean): { beforeLines: string[]; sectionLines: string[]; afterLines: string[] } {
        var sectionEndLineTrimmed = sectionEndLine.trim();
        var sectionStartLineTrimmed = sectionStartLine.trim();
        var linesSection = {
            beforeLines: [],
            sectionLines: [],
            afterLines: [],
        }

        var BEFORE_SECTION = 1;
        var IN_SECTION = 2;
        var AFTER_SECTION = 3;
        var state = BEFORE_SECTION;

        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            if (state === AFTER_SECTION) {
                linesSection.afterLines.push(line);
            }
            else if (state === IN_SECTION) {
                if (line.trim() === sectionEndLineTrimmed) {
                    state = AFTER_SECTION;

                    if (includeStartEndLinesInSection) { linesSection.sectionLines.push(line); }
                    else { linesSection.afterLines.push(line); }
                }
                else {
                    linesSection.sectionLines.push(line);
                }
            }
            else if (state === BEFORE_SECTION) {
                if (line.trim() === sectionStartLineTrimmed) {
                    state = IN_SECTION;

                    if (includeStartEndLinesInSection) { linesSection.sectionLines.push(line); }
                    else { linesSection.beforeLines.push(line); }
                }
                else {
                    linesSection.beforeLines.push(line);
                }
            }
            else {
                throw new Error("unknown state '" + state + "' while parsing lines sub-section");
            }
        }

        return linesSection;
    }



    // split a set of lines into a matching section and the lines that come before and after that section
    export function readLinesSections(lines: string[], sectionStartEndLines: [string, string][], includeStartEndLinesInSection: boolean): { [sectionName: string]: string[] } {
        var sectionStartLinesTrimmed = sectionStartEndLines.map((strs) => strs[0].trim());
        var sectionEndLinesTrimmed = sectionStartEndLines.map((strs) => strs[1].trim());
        var linesSections: { [sectionName: string]: string[] } = {};

        // detect the most common opening XML tab in a list of XML lines where each line has a single opening and closing XML tag
        function detectSectionName(lines: string[]): string {
            var types: { [startsWith: string]: number } = {};

            for (var i = 0, size = lines.length; i < size; i++) {
                var line = StringUtil.removeLeading(lines[i].trim(), "<");
                line = StringUtil.removeTrailing(line, ">");
                var startStr = line.split(' ', 2)[0];

                types[startStr] = (types[startStr] || 0) + 1;
            }

            var highestCountProp: string = null;
            var highestCount = 0;
            var props = Object.keys(types);
            for (var i = 0, size = props.length; i < size; i++) {
                var value = types[props[i]];
                if (value > highestCount) {
                    highestCount = value;
                    highestCountProp = props[i];
                }
            }
            return highestCountProp;
        }


        function setupNextSection() {
            var sectionName = detectSectionName(currentSection);
            if (sectionName != null) {
                delete linesSections[currentSectionName];
                linesSections[sectionName] = currentSection;
            }

            sectionNum++;
            currentSectionName = "_" + sectionNum;
            currentSection = (linesSections[currentSectionName] = []);
        }


        var sectionNum = 0;
        var currentSectionName = "_" + sectionNum;
        var currentSection: string[] = (linesSections[currentSectionName] = []);

        // initialize the first section
        setupNextSection();

        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            var lineTrimmed = line.trim();
            var isStartLine = sectionStartLinesTrimmed.indexOf(lineTrimmed);
            var isEndLine = sectionEndLinesTrimmed.indexOf(lineTrimmed);

            // add current line to the current section, after/before starting the new section, or before/after ending the current section, depending on the include in section flag
            if (isStartLine) {
                if (!includeStartEndLinesInSection) { currentSection.push(line); }
                setupNextSection();
                if (includeStartEndLinesInSection) { currentSection.push(line); }
            }
            else if (isEndLine) {
                if (includeStartEndLinesInSection) { currentSection.push(line); }
                setupNextSection();
                if (!includeStartEndLinesInSection) { currentSection.push(line); }
            }
            else {
                currentSection.push(line);
            }
        }

        return linesSections;
    }

}

export = ReadFile;
