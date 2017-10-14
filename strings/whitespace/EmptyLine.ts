
module EmptyLine {

    export function preAppendIfAny(strs: string[],
            preToAddIfAny: string[], preToAddIfNone: string[], prevLines: string[],
            postToAddIfAny: string[], postToAddIfNone: string[], nextLines: string[], dst: string[] = []): string[] {
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


    export function preAppendIndentIfAny(genTools: GenTools, strs: string[],
            preToAddIfAny: string[], preToAddIfNone: string[], prevLines: string[],
            postToAddIfAny: string[], postToAddIfNone: string[], nextLines: string[], dst: string[] = []): string[] {
        var res = preAppendIfAny(strs, preToAddIfAny, preToAddIfNone, prevLines, postToAddIfAny, postToAddIfNone, nextLines, dst);
        return res;
    }


    // Copied from ts-mortar/utils/Arrays
    function addAll<E>(src: E[], toAdd: E[]): E[] {
        if (toAdd != null && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }

}

export = EmptyLine;
