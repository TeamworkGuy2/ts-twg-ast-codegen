import Arrays = require("../../ts-mortar/utils/Arrays");
import ReadFile = require("./ReadFile");
import WriteFile = require("./WriteFile");

/** A manipulator for a file sections map created by {@link ReadFile#readLinesSections()) or similar function
 * @since 2015-8-11
 */
class FileSectionManipulator {
    private filePath: string;
    private fileSections: { [sectionName: string]: string[] };


    constructor() {
    }


    public addSectionLines(sectionName: string, lines: string[]) {
        var section = this.fileSections[sectionName];
        if (section == null) {
            throw new Error("file '" + this.filePath + "' does not contain section named '" + sectionName + "'");
        }
        Arrays.addAll(section, lines);
    }


    public getSections() {
        return this.fileSections;
    }


    public loadFile(filePath: string, sectionStartEndStrs: [string, string][]) {
        this.filePath = filePath;
        this.fileSections = ReadFile.readLinesSections(ReadFile.readLines(this.filePath), sectionStartEndStrs, false);
    }


    public saveFile(filePath: string = this.filePath) {
        WriteFile.writeFileSections(filePath, this.fileSections);
    }

}

export = FileSectionManipulator;
