
/** Methods for building an array of strings with methods for working with prefixes, suffixes, and indentation.
 * Includes static methods for toString()'ing objects with nested properties, and static methods
 * for adding prefixes and suffixes to arrays, as well as flattening nested arrays.
 * @author TeamworkGuy2
 */
class StringArray {
    private strs: string[] = [];


    public add(str: string | number | boolean) {
        this.strs.push(String(str));
        return this;
    }


    public addAll(strAry: (string | number | boolean)[]) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(String(strAry[i]));
        }
        return this;
    }


    public insert(str: string | number | boolean, idx: number = 0) {
        if (idx === 0) {
            this.strs.unshift(String(str));
        }
        else {
            this.strs = StringArray.splice(this.strs, [String(str)], idx);
        }
        return this;
    }


    public insertAll(strAry: (string | number | boolean)[], idx: number = 0) {
        if (idx === 0) {
            for (var i = strAry.length - 1; i > -1; i--) {
                this.strs.unshift(String(strAry[i]));
            }
        }
        else {
            this.strs = StringArray.splice(this.strs, strAry.map((s) => String(s)), idx);
        }
        return this;
    }


    public addLines(str: string) {
        var lines = str.split(/\n|\r\n/);
        for (var i = 0, size = lines.length; i < size; i++) {
            this.strs.push(lines[i]);
        }
        return this;
    }


    public prefixAll(prefix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = prefix + this.strs[i];
        }
        return this;
    }


    public suffixAll(suffix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = this.strs[i] + suffix;
        }
        return this;
    }


    public prefixNonEmpty(prefix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = prefix + str;
            }
        }
        return this;
    }


    public suffixNonEmpty(suffix: string) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = str + suffix;
            }
        }
        return this;
    }


    public addPrefixAll(strAry: string[], prefix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(prefix + strAry[i]);
        }
        return this;
    }


    public addSuffixAll(strAry: string[], suffix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(strAry[i] + suffix);
        }
        return this;
    }


    public addPrefixNonEmpty(strAry: string[], prefix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? prefix + str : str);
        }
        return this;
    }


    public addSuffixNonEmpty(strAry: string[], suffix: string) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? str + suffix : str);
        }
        return this;
    }


    public filterOutEmpty() {
        var res: string[] = [];
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                res.push(str);
            }
        }
        this.strs = res;
        return this;
    }


    public getLines(copy: boolean = true) {
        return copy ? this.strs.slice() : this.strs;
    }


    public join(separator?: string): string {
        return this.strs.join(separator);
    }


    public copy() {
        return StringArray.of(this.strs, true);
    }


    public static of(strs: string | string[], copy: boolean = true): StringArray {
        var inst = new StringArray();
        inst.strs = Array.isArray(strs) ? (copy ? strs.slice() : strs) : [strs];
        return inst;
    }


    public static newInst() {
        var inst = new StringArray();
        return inst;
    }

}

module StringArray {

    /** Alias for toStringFromObjectsDeep()
     */
    export function toStrings(obj: any): string[] {
        var lines: string[] = [];
        toStringFromObjectsDeep(obj, lines);
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
            var props = Object.keys(<{}>obj);
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
                            toStringFromObjectsDeep(ary[ii], dst);
                        }
                    }
                }
                // Object
                else {
                    toStringFromObjectsDeep(prop, dst);
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
                    toStringFromObjectsDeep(ary[i], dst);
                }
            }
        }
    }


    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened string array with the 'join' string[] inserted between each property
     */
    export function flattenMapJoin(obj: { [id: string]: string[] }, join: string[], keys: string[] = Object.keys(obj), dst: string[] = []): string[] {
        if (join) {
            for (var i = 0, count = keys.length - 1; i < count; i++) {
                var prop = obj[keys[i]];
                addAll(dst, prop);
                addAll(dst, join);
            }
            if (count > 0) {
                addAll(dst, obj[keys[count]]);
            }
        }
        else {
            for (var i = 0, size = keys.length; i < size; i++) {
                var prop = obj[keys[i]];
                addAll(dst, prop);
            }
        }

        return dst;
    }


    export function flatten(strsAry: string[][]): string[] {
        return joinMulti(strsAry, null, []);
    }


    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened 'strsAry' joined by 'join'
     */
    export function joinMulti(strArys: string[][], join?: string[] | null, dst: string[] = []): string[] {
        var sizeN1 = strArys.length - 1;
        if (sizeN1 > 0) {
            for (var i = 0; i < sizeN1; i++) {
                var strs = strArys[i];
                addAll(dst, strs);
                if (join) {
                    addAll(dst, join);
                }
            }
            addAll(dst, strArys[sizeN1 - 1]);
        }

        return dst;
    }


    /** Add an optional prefix and suffix to a string and return the result
     */
    export function preAppendStr(prefix: string, str: string, suffix: string): string {
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
            else {
                // impossible
                return <never>null;
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
     * @return 'strs' with prefix and suffix strings added
     */
    export function preAppend(prefix: string, suffix: string, strs: string[], dst: string[] = []): string[] {

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


    /** Add a common prefix and suffix string to each of the non-empty strings in an array of strings
     * @return 'strs' with prefix and suffix strings added
     */
    export function preAppendNonEmpty(prefix: string, suffix: string, strs: string[], dst: string[] = []): string[] {

        if (prefix || suffix) {
            if (prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? prefix + str + suffix : str);
                }
            }
            else if (prefix && !suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? prefix + str : str);
                }
            }
            else if (!prefix && suffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    var str = strs[i];
                    dst.push(str.length > 0 ? str + suffix : str);
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


    // Copied from ts-mortar/utils/Arrays
    export function addAll<E>(src: E[], toAdd: E[]): E[] {
        if (toAdd != null && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }


    // Copied from ts-mortar/utils/Arrays
    export function splice<E>(origAry: E[], insertAry: E[], index: number): E[] {
        if (insertAry.length === 0) {
            return origAry;
        }

        // add to the end of the array
        if (index === origAry.length) {
            Array.prototype.push.apply(origAry, insertAry);
        }
        // add to the beginning of the array
        else if (index === 0) {
            Array.prototype.unshift.apply(origAry, insertAry);
        }
        // copy up to the index to insert, then insert the array, and copying the remaining portion
        else {
            var tmp: E[] = [];
            for (var i = 0; i < index; i++) {
                tmp.push(origAry[i]);
            }

            Array.prototype.push.apply(tmp, insertAry);

            for (var i = index, size = origAry.length; i < size; i++) {
                tmp.push(origAry[i]);
            }
            return tmp;
        }
        return origAry;
    }

}

export = StringArray;
