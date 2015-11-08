"use strict";

module StringArray {

    /** Alias for {@link #toStringFromObjectsDeep()} 
     */
    export function toStrings(obj: any): string[] {
        var lines: string[] = [];
        StringArray.toStringFromObjectsDeep(obj, lines);
        return lines;
    }


    /** Convert a multi-level object to an array of string by recursively traversing each property of the object and appending string, string[] properties to the returned array
     */
    export function toStringFromObjectsDeep(obj: any, dst: string[] = []) {
        // String
        if (typeof obj === "string") {
            dst.push(obj);
        }
        // Object
        else if (!Array.isArray(obj)) {
            var props = Object.keys(obj);
            // Object properties
            for (var i = 0, size = props.length; i < size; i++) {
                var prop = obj[props[i]];
                // String
                if (typeof prop === "string") {
                    dst.push(prop);
                }
                // Array
                else if (Array.isArray(prop)) {
                    var ary: any[] = prop;
                    for (var ii = 0, sizeI = ary.length; ii < sizeI; ii++) {
                        if (typeof ary[ii] === "string") {
                            dst.push(ary[ii]);
                        }
                        else {
                            StringArray.toStringFromObjectsDeep(ary[ii], dst);
                        }
                    }
                }
                // Object
                else {
                    StringArray.toStringFromObjectsDeep(prop, dst);
                }
            }
        }
        // Array
        else {
            var ary: any[] = obj;
            for (var i = 0, size = ary.length; i < size; i++) {
                if (typeof ary[i] === "string") {
                    dst.push(ary[i]);
                }
                else {
                    StringArray.toStringFromObjectsDeep(ary[i], dst);
                }
            }
        }
    }


    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened object with {@code join} string[] inserted between each property
     */
    export function stringMapToArrayJoin(obj: { [id: string]: string[]| string }, join: string[], dst: string[] = []): string[] {
        var props = Object.keys(obj);
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = obj[props[i]];
            if (Array.isArray(prop)) {
                Array.prototype.push.apply(dst, prop);
            }
            else {
                dst.push(<string>prop);
            }

            if (join && i < size - 1) {
                Array.prototype.push.apply(dst, join);
            }
        }

        return dst;
    }


    export function flatten(strsAry: string[][]): string[] {
        return StringArray.joinMulti(strsAry, null, []);
    }


    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened {@code strsAry} joined by {@code join}
     */
    export function joinMulti(strArys: string[][], join?: string[], dst: string[] = []): string[] {
        var sizeN1 = strArys.length - 1;
        if (sizeN1 > 0) {
            for (var i = 0; i < sizeN1; i++) {
                var strs = strArys[i];
                Array.prototype.push.apply(dst, strs);
                Array.prototype.push.apply(dst, join);
            }
            Array.prototype.push.apply(dst, strArys[sizeN1 - 1]);
        }

        return dst;
    }


    /** Add an optional prefix and suffix to a string and return the result
     */
    export function preAppend(prefix: string, str: string, suffix: string): string {
        if (prefix || suffix) {
            if (prefix && suffix) {
                return prefix + str + suffix;
            }
            else if (prefix && !suffix) {
                return prefix + str;
            }
            else if (!prefix && suffix) {
                return str + suffix;
            }
        }
        else {
            return str;
        }
    }


    /** Add optional prefix and suffix strings to an array of strings
     */
    export function preAppendArray(prefix: string, ary: string[], suffix: string): string[] {
        if (prefix) {
            ary.unshift(prefix);
        }
        if (suffix) {
            ary.push(suffix);
        }
        return ary;
    }


    /** Add a common prefix and suffix string to each of the strings in an array of strings
     * @return {@code strs} with prefix and suffix strings added
     */
    export function preAppendEach(prefix: string, suffix: string, strs: string[], dst: string[] = []): string[] {

        if (prefix || suffix) {
            if (prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(prefix + strs[i] + suffix);
                }
            }
            else if (prefix && !suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(prefix + strs[i]);
                }
            }
            else if (!prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(strs[i] + suffix);
                }
            }
        }
        else {
            for (var i = 0, size = strs.length; i < size; i++) {
                dst.push(strs[i]);
            }
        }

        return dst;
    }


}

export = StringArray;
