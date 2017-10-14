"use strict";
var EmptyLine;
(function (EmptyLine) {
    function preAppendIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst) {
        if (dst === void 0) { dst = []; }
        if (strs && strs.length > 0) {
            if (prevLines && prevLines.length > 0) {
                addAll(dst, preToAddIfAny);
            }
            else {
                addAll(dst, preToAddIfNone);
            }
            addAll(dst, strs);
            if (nextLines && nextLines.length > 0) {
                addAll(dst, postToAddIfAny);
            }
            else {
                addAll(dst, postToAddIfNone);
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
    // Copied from ts-mortar/utils/Arrays
    function addAll(src, toAdd) {
        if (toAdd != null && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }
})(EmptyLine || (EmptyLine = {}));
module.exports = EmptyLine;
