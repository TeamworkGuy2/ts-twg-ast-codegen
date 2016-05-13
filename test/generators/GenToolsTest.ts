"use strict";
import DefaultGenTools = require("../../generators/DefaultGenTools");
import DefaultPrettyPrinter = require("../../strings/whitespace/DefaultPrettyPrinter");

QUnit.module("GenToolsTest", {
});

QUnit.test("DefaultGenTools", function DefaultGenToolsTest(sr) {
    var tab = "\t";
    var nwln = "\n";

    var gen = DefaultGenTools.newInst(DefaultPrettyPrinter.newInst(tab, 0));
    var dst: string[] = [];

    gen.indent(dst, ["//start"]);
    gen.indent(dst, ["//GenToolsTest", ""]);
    gen.printer.indent();
    gen.indentNonEmpty(dst, "{");
    gen.indentNonEmpty(dst, ['"alpha": 1', '', '"omega": "NaN"']);
    gen.indent(dst, "};");
    gen.printer.dedent();
    gen.indent(dst, "//end");

    sr.equal(dst.join(nwln), 
        "//start" + nwln +
        "//GenToolsTest" + nwln +
        "" + nwln +
        tab + "{" + nwln +
        tab + '"alpha": 1' + nwln +
        "" + nwln +
        tab + '"omega": "NaN"' + nwln +
        tab + "};" + nwln +
        "//end"
    );
});