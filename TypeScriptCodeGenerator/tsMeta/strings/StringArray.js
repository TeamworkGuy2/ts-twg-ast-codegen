"use strict";
var StringArray = (function () {
    function StringArray() {
    }
    /** Add a common prefix and suffix string to each of the strings in an array of strings
     * @return {@code strs} with prefix and suffix strings added
     */
    StringArray.addCommonPreSuffix = function (commonPrefix, commonSuffix, strs, dst) {
        if (dst === void 0) { dst = []; }
        if (commonPrefix || commonSuffix) {
            if (commonPrefix && commonSuffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(commonPrefix + strs[i] + commonSuffix);
                }
            }
            else if (commonPrefix && !commonSuffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(commonPrefix + strs[i]);
                }
            }
            else if (!commonPrefix && commonSuffix) {
                for (var i = 0, size = strs.length; i < size; i++) {
                    dst.push(strs[i] + commonSuffix);
                }
            }
        }
        else {
            for (var i = 0, size = strs.length; i < size; i++) {
                dst.push(strs[i]);
            }
        }
        return dst;
    };
    /** Alias for {@link #toStringFromObjectsDeep()}
     */
    StringArray.toStrings = function (obj) {
        var lines = [];
        StringArray.toStringFromObjectsDeep(obj, lines);
        return lines;
    };
    /** Convert a multi-level object to an array of string by recursively traversing each property of the object and appending string, string[] properties to the returned array
     */
    StringArray.toStringFromObjectsDeep = function (obj, dst) {
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
    };
    /** Convert a single level object containing string or string[] properties to an array of strings
     * @return the flattened object with {@code join} string[] inserted between each property
     */
    StringArray.stringMapToArrayJoin = function (obj, join, dst) {
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
    };
    StringArray.flatten = function (strsAry) {
        return StringArray.stringArrayJoin(strsAry, null, []);
    };
    /** Flatten a string[][] and optionally insert a 'join' string[] between each array
     * @return the flattened {@code strsAry} joined by {@code join}
     */
    StringArray.stringArrayJoin = function (strsAry, join, dst) {
        if (dst === void 0) { dst = []; }
        for (var i = 0, size = strsAry.length; i < size; i++) {
            var strs = strsAry[i];
            Array.prototype.push.apply(dst, strs);
            if (join && i < size - 1) {
                Array.prototype.push.apply(dst, join);
            }
        }
        return dst;
    };
    /** Added an optional prefix and suffix to a string and return the result
     */
    StringArray.of = function (prefix, str, suffix) {
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
    };
    /** Add a string to the beginning and end of an array
     */
    StringArray.addPrePostStrings = function (prefix, ary, suffix) {
        if (prefix) {
            ary.unshift(prefix);
        }
        if (suffix) {
            ary.push(suffix);
        }
        return ary;
    };
    return StringArray;
})();
module.exports = StringArray;
