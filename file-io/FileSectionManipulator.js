"use strict";
var ReadFile = require("./ReadFile");
var WriteFile = require("./WriteFile");
/** A manipulator for a file sections map created by {@link ReadFile#readLinesSections()) or similar function
 * @since 2015-8-11
 */
var FileSectionManipulator = (function () {
    function FileSectionManipulator() {
    }
    FileSectionManipulator.prototype.addSectionLines = function (sectionName, lines) {
        var section = this.fileSections[sectionName];
        if (section == null) {
            throw new Error("file '" + this.filePath + "' does not contain section named '" + sectionName + "'");
        }
        Array.prototype.push.apply(section, lines);
    };
    FileSectionManipulator.prototype.getSections = function () {
        return this.fileSections;
    };
    FileSectionManipulator.prototype.loadFile = function (filePath, sectionStartEndStrs) {
        this.filePath = filePath;
        this.fileSections = ReadFile.readLinesSections(ReadFile.readLines(this.filePath), sectionStartEndStrs, false);
    };
    FileSectionManipulator.prototype.saveFile = function (filePath) {
        if (filePath === void 0) { filePath = this.filePath; }
        WriteFile.writeFileSections(filePath, this.fileSections);
    };
    return FileSectionManipulator;
}());
module.exports = FileSectionManipulator;
