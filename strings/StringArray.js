"use strict";
var StringArray;
(function (StringArray) {
    /** Alias for {@link #toStringFromObjectsDeep()}
     */
    function toStrings(obj) {
        var lines = [];
        StringArray.toStringFromObjectsDeep(obj, lines);
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
                            StringArray.toStringFromObjectsDeep(ary[ii], dst);
                        }
                    }
                }
                else {
                    StringArray.toStringFromObjectsDeep(prop, dst);
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
                    StringArray.toStringFromObjectsDeep(ary[i], dst);
                }
            }
        }
    }
    StringArray.toStringFromObjectsDeep = toStringFromObjectsDeep;
    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened object with {@code join} string[] inserted between each property
     */
    function stringMapToArrayJoin(obj, join, dst) {
        if (dst === void 0) { dst = []; }
        var props = Object.keys(obj);
        for (var i = 0, size = props.length; i < size; i++) {
            var prop = obj[props[i]];
            if (Array.isArray(prop)) {
                Array.prototype.push.apply(dst, prop);
            }
            else {
                dst.push(prop);
            }
            if (join && i < size - 1) {
                Array.prototype.push.apply(dst, join);
            }
        }
        return dst;
    }
    StringArray.stringMapToArrayJoin = stringMapToArrayJoin;
    function flatten(strsAry) {
        return StringArray.joinMulti(strsAry, null, []);
    }
    StringArray.flatten = flatten;
    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened {@code strsAry} joined by {@code join}
     */
    function joinMulti(strArys, join, dst) {
        if (dst === void 0) { dst = []; }
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
    StringArray.joinMulti = joinMulti;
    /** Add an optional prefix and suffix to a string and return the result
     */
    function preAppend(prefix, str, suffix) {
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
    StringArray.preAppend = preAppend;
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
     * @return {@code strs} with prefix and suffix strings added
     */
    function preAppendEach(prefix, suffix, strs, dst) {
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
    StringArray.preAppendEach = preAppendEach;
})(StringArray || (StringArray = {}));
module.exports = StringArray;
