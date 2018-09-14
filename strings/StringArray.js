"use strict";
/** Methods for building an array of strings with methods for working with prefixes, suffixes, and indentation.
 * Includes static methods for toString()'ing objects with nested properties, and static methods
 * for adding prefixes and suffixes to arrays, as well as flattening nested arrays.
 * @author TeamworkGuy2
 */
var StringArray = (function () {
    function StringArray() {
        this.strs = [];
    }
    StringArray.prototype.add = function (str) {
        this.strs.push(String(str));
        return this;
    };
    StringArray.prototype.addAll = function (strAry) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(String(strAry[i]));
        }
        return this;
    };
    StringArray.prototype.insert = function (str, idx) {
        if (idx === void 0) { idx = 0; }
        if (idx === 0) {
            this.strs.unshift(String(str));
        }
        else {
            this.strs = StringArray.splice(this.strs, [String(str)], idx);
        }
        return this;
    };
    StringArray.prototype.insertAll = function (strAry, idx) {
        if (idx === void 0) { idx = 0; }
        if (idx === 0) {
            for (var i = strAry.length - 1; i > -1; i--) {
                this.strs.unshift(String(strAry[i]));
            }
        }
        else {
            this.strs = StringArray.splice(this.strs, strAry.map(function (s) { return String(s); }), idx);
        }
        return this;
    };
    StringArray.prototype.addLines = function (str) {
        var lines = str.split(/\n|\r\n/);
        for (var i = 0, size = lines.length; i < size; i++) {
            this.strs.push(lines[i]);
        }
        return this;
    };
    StringArray.prototype.prefixAll = function (prefix) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = prefix + this.strs[i];
        }
        return this;
    };
    StringArray.prototype.suffixAll = function (suffix) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            this.strs[i] = this.strs[i] + suffix;
        }
        return this;
    };
    StringArray.prototype.prefixNonEmpty = function (prefix) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = prefix + str;
            }
        }
        return this;
    };
    StringArray.prototype.suffixNonEmpty = function (suffix) {
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                this.strs[i] = str + suffix;
            }
        }
        return this;
    };
    StringArray.prototype.addPrefixAll = function (strAry, prefix) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(prefix + strAry[i]);
        }
        return this;
    };
    StringArray.prototype.addSuffixAll = function (strAry, suffix) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            this.strs.push(strAry[i] + suffix);
        }
        return this;
    };
    StringArray.prototype.addPrefixNonEmpty = function (strAry, prefix) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? prefix + str : str);
        }
        return this;
    };
    StringArray.prototype.addSuffixNonEmpty = function (strAry, suffix) {
        for (var i = 0, size = strAry.length; i < size; i++) {
            var str = strAry[i];
            this.strs.push(str.length > 0 ? str + suffix : str);
        }
        return this;
    };
    StringArray.prototype.filterOutEmpty = function () {
        var res = [];
        for (var i = 0, size = this.strs.length; i < size; i++) {
            var str = this.strs[i];
            if (str.length > 0) {
                res.push(str);
            }
        }
        this.strs = res;
        return this;
    };
    StringArray.prototype.getLines = function (copy) {
        if (copy === void 0) { copy = true; }
        return copy ? this.strs.slice() : this.strs;
    };
    StringArray.prototype.join = function (separator) {
        return this.strs.join(separator);
    };
    StringArray.prototype.copy = function () {
        return StringArray.of(this.strs, true);
    };
    StringArray.of = function (strs, copy) {
        if (copy === void 0) { copy = true; }
        var inst = new StringArray();
        inst.strs = Array.isArray(strs) ? (copy ? strs.slice() : strs) : [strs];
        return inst;
    };
    StringArray.newInst = function () {
        var inst = new StringArray();
        return inst;
    };
    return StringArray;
}());
(function (StringArray) {
    /** Alias for toStringFromObjectsDeep()
     */
    function toStrings(obj) {
        var lines = [];
        toStringFromObjectsDeep(obj, lines);
        return lines;
    }
    StringArray.toStrings = toStrings;
    /** Convert a multi-level object to an array of string by recursively traversing each property of the object and appending string, string[] properties to the returned array
     */
    function toStringFromObjectsDeep(obj, dst) {
        if (dst === void 0) { dst = []; }
        // String
        if (typeof obj === "string") {
            dst.push(obj);
        }
        else if (!Array.isArray(obj)) {
            var props = Object.keys(obj);
            // Object properties
            for (var i = 0, size = props.length; i < size; i++) {
                var prop = obj[props[i]];
                // String
                if (typeof prop === "string") {
                    dst.push(prop);
                }
                else if (Array.isArray(prop)) {
                    var ary = prop;
                    for (var ii = 0, sizeI = ary.length; ii < sizeI; ii++) {
                        if (typeof ary[ii] === "string") {
                            dst.push(ary[ii]);
                        }
                        else {
                            toStringFromObjectsDeep(ary[ii], dst);
                        }
                    }
                }
                else {
                    toStringFromObjectsDeep(prop, dst);
                }
            }
        }
        else {
            var ary = obj;
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
    StringArray.toStringFromObjectsDeep = toStringFromObjectsDeep;
    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened string array with the 'join' string[] inserted between each property
     */
    function flattenMapJoin(obj, join, keys, dst) {
        if (keys === void 0) { keys = Object.keys(obj); }
        if (dst === void 0) { dst = []; }
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
    StringArray.flattenMapJoin = flattenMapJoin;
    function flatten(strsAry) {
        return joinMulti(strsAry, null, []);
    }
    StringArray.flatten = flatten;
    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened 'strsAry' joined by 'join'
     */
    function joinMulti(strArys, join, dst) {
        if (dst === void 0) { dst = []; }
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
    StringArray.joinMulti = joinMulti;
    /** Add an optional prefix and suffix to a string and return the result
     */
    function preAppendStr(prefix, str, suffix) {
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
                return null;
            }
        }
        else {
            return str;
        }
    }
    StringArray.preAppendStr = preAppendStr;
    /** Add optional prefix and suffix strings to an array of strings
     */
    function preAppendArray(prefix, ary, suffix) {
        if (prefix) {
            ary.unshift(prefix);
        }
        if (suffix) {
            ary.push(suffix);
        }
        return ary;
    }
    StringArray.preAppendArray = preAppendArray;
    /** Add a common prefix and suffix string to each of the strings in an array of strings
     * @return 'strs' with prefix and suffix strings added
     */
    function preAppend(prefix, suffix, strs, dst) {
        if (dst === void 0) { dst = []; }
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
    StringArray.preAppend = preAppend;
    /** Add a common prefix and suffix string to each of the non-empty strings in an array of strings
     * @return 'strs' with prefix and suffix strings added
     */
    function preAppendNonEmpty(prefix, suffix, strs, dst) {
        if (dst === void 0) { dst = []; }
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
    StringArray.preAppendNonEmpty = preAppendNonEmpty;
    // Copied from ts-mortar/utils/Arrays
    function addAll(src, toAdd) {
        if (toAdd != null && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }
    StringArray.addAll = addAll;
    // Copied from ts-mortar/utils/Arrays
    function splice(origAry, insertAry, index) {
        if (insertAry.length === 0) {
            return origAry;
        }
        // add to the end of the array
        if (index === origAry.length) {
            Array.prototype.push.apply(origAry, insertAry);
        }
        else if (index === 0) {
            Array.prototype.unshift.apply(origAry, insertAry);
        }
        else {
            var tmp = [];
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
    StringArray.splice = splice;
})(StringArray || (StringArray = {}));
module.exports = StringArray;
