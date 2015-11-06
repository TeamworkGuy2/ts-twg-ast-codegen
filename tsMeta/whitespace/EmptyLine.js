"use strict";
var EmptyLine;
(function (EmptyLine) {
    function prePostIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst) {
        if (dst === void 0) { dst = []; }
        if (strs && strs.length > 0) {
            if (prevLines && prevLines.length > 0) {
                Array.prototype.push.apply(dst, preToAddIfAny);
            }
            else {
                Array.prototype.push.apply(dst, preToAddIfNone);
            }
            Array.prototype.push.apply(dst, strs);
            if (nextLines && nextLines.length > 0) {
                Array.prototype.push.apply(dst, postToAddIfAny);
            }
            else {
                Array.prototype.push.apply(dst, postToAddIfNone);
            }
        }
        return dst;
    }
    EmptyLine.prePostIfAny = prePostIfAny;
})(EmptyLine || (EmptyLine = {}));
module.exports = EmptyLine;
