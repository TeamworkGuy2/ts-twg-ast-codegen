"use strict";
import Arrays = require("../../lib/ts-mortar/utils/Arrays");
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

}

export = WriteFile;
