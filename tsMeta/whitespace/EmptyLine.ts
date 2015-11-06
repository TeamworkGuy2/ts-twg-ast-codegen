"use strict";

module EmptyLine {

    export function prePostIfAny(strs: string[],
            preToAddIfAny: string[], preToAddIfNone: string[], prevLines: string[],
            postToAddIfAny: string[], postToAddIfNone: string[], nextLines: string[], dst: string[] = []): string[]{
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

}

export = EmptyLine;
