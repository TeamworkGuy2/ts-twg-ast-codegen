"use strict";
var ArrayUtil;
(function (ArrayUtil) {
    /** Create a copy of an array
     */
    function copy(src) {
        return addAll(src, []);
    }
    ArrayUtil.copy = copy;
    /** Add all of the values in {@code toAdd} to the {@code src} array
     * @return the source array
     */
    function addAll(src, toAdd) {
        if (toAdd && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }
    ArrayUtil.addAll = addAll;
    // ==== Remove ====
    /** Remove all values from an array
     */
    function clear(ary) {
        if (ary == null) {
            return;
        }
        for (var i = 0, size = ary.length; i < size; i++) {
            ary.pop();
        }
    }
    ArrayUtil.clear = clear;
    /** Remove the first matching value from an array without creating a new array of splicing the array.
     * NOTE: the returned order of the array's elements is not defined.
     * @param {E[]} ary  the array of values to search and remove the matching value from
     * @param {Object} value  the value to search for and remove
     * @return {@code ary} of values with the first matching instance of {@code value} removed,
     * values are compared based on strict equality '===='
     */
    function fastRemoveValue(ary, value) {
        var aryLen = ary != null ? ary.length : 0;
        if (aryLen === 0) {
            return ary;
        }
        for (var i = 0; i < aryLen; i++) {
            if (ary[i] === value) {
                ary[i] = ary[aryLen - 1];
                ary.pop();
                break;
            }
        }
        return ary;
    }
    ArrayUtil.fastRemoveValue = fastRemoveValue;
    /** Remove a value at a specific index from an array without creating a new array of splicing the array.
     * NOTE: the returned order of the array's elements is not defined.
     * @param {E[]} ary  the array of values to remove the index value from
     * @param {number} index  the index of the value to remove from the array
     * @return {@code ary} of values with the specified index removed
     */
    function fastRemoveIndex(ary, index) {
        var aryLen = ary != null ? ary.length : 0;
        if (aryLen === 0) {
            return ary;
        }
        if (aryLen > 1) {
            ary[index] = ary[aryLen - 1];
        }
        ary.pop();
        return ary;
    }
    ArrayUtil.fastRemoveIndex = fastRemoveIndex;
})(ArrayUtil || (ArrayUtil = {}));
module.exports = ArrayUtil;
