"use strict";

module ArrayUtil {

    /** Create a copy of an array
     */
    export function copy<E>(src: E[]) {
        return addAll(src, []);
    }


    /** Add all of the values in {@code toAdd} to the {@code src} array
     * @return the source array
     */
    export function addAll<E>(src: E[], toAdd: E[]): E[]{
        if (toAdd && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }


    // ==== Remove ====

    /** Remove all values from an array
     */
    export function clear(ary: any[]): void {
        if (ary == null) {
            return;
        }
        for (var i = 0, size = ary.length; i < size; i++) {
            ary.pop();
        }
    }


    /** Remove the first matching value from an array without creating a new array of splicing the array.
     * NOTE: the returned order of the array's elements is not defined.
     * @param {E[]} ary  the array of values to search and remove the matching value from
     * @param {Object} value  the value to search for and remove
     * @return {@code ary} of values with the first matching instance of {@code value} removed,
     * values are compared based on strict equality '===='
     */
    export function fastRemoveValue<E>(ary: E[], value: any): E[] {
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


    /** Remove a value at a specific index from an array without creating a new array of splicing the array.
     * NOTE: the returned order of the array's elements is not defined.
     * @param {E[]} ary  the array of values to remove the index value from
     * @param {number} index  the index of the value to remove from the array
     * @return {@code ary} of values with the specified index removed
     */
    export function fastRemoveIndex<E>(ary: E[], index: number): E[] {
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

}

export = ArrayUtil;
