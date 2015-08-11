"use strict";

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
            Array.prototype.push.apply(allLines, linesSections[props[i]]);
        }

        writeFile(filePath, allLines);
    }

}

export = WriteFile;
