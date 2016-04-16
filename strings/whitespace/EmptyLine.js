"use strict";
var Arrays = require("../../../ts-mortar/utils/Arrays");
var EmptyLine;
(function (EmptyLine) {
    function preAppendIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst) {
        if (dst === void 0) { dst = []; }
        if (strs && strs.length > 0) {
            if (prevLines && prevLines.length > 0) {
                Arrays.addAll(dst, preToAddIfAny);
            }
            else {
                Arrays.addAll(dst, preToAddIfNone);
            }
            Arrays.addAll(dst, strs);
            if (nextLines && nextLines.length > 0) {
                Arrays.addAll(dst, postToAddIfAny);
            }
            else {
                Arrays.addAll(dst, postToAddIfNone);
            }
        }
        return dst;
    }
    EmptyLine.preAppendIfAny = preAppendIfAny;
    function preAppendIndentIfAny(genTools, strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst) {
        if (dst === void 0) { dst = []; }
        var res = preAppendIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst);
        return res;
    }
    EmptyLine.preAppendIndentIfAny = preAppendIndentIfAny;
})(EmptyLine || (EmptyLine = {}));
module.exports = EmptyLine;
