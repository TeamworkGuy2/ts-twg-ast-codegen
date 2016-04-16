"use strict";
import Arrays = require("../../../ts-mortar/utils/Arrays");

module EmptyLine {

    export function preAppendIfAny(strs: string[],
            preToAddIfAny: string[], preToAddIfNone: string[], prevLines: string[],
            postToAddIfAny: string[], postToAddIfNone: string[], nextLines: string[], dst: string[] = []): string[] {
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


    export function preAppendIndentIfAny(genTools: GenTools, strs: string[],
            preToAddIfAny: string[], preToAddIfNone: string[], prevLines: string[],
            postToAddIfAny: string[], postToAddIfNone: string[], nextLines: string[], dst: string[] = []): string[] {
        var res = preAppendIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst);
        return res;
    }

}

export = EmptyLine;
