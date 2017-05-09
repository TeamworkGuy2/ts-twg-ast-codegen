"use strict";
/** StringCase - functions for checking if a string conforms to a programming naming convention
 * such as TitleCase, camelCase, Under_Score_Case, etc.
 */
var StringCase;
(function (StringCase) {
    /** Test if all characters in a string are digits
     * @param str: the string to check
     * @return true if every character in the string is a digit 0-9, false if not
     */
    function isDigit(str) {
        if (str == null) {
            return false;
        }
        for (var i = 0, size = str.length; i < size; i++) {
            var ch = str.charCodeAt(i) - 48;
            if (ch < 0 || ch > 9) {
                return false;
            }
        }
        return true;
    }
    /** Test if a char at a specific index in a string is upper case
     * For example: isCharAtUpperCase("Blue", 0)
     * returns: true
     * Or example: isCharAtUpperCase("Blue", 3)
     * returns: false
     * @param str: the string that the char resides in
     * @param i: the index of the character in 'str' to test
     * @return true if the character at index 'i' is upper case
     */
    function isCharAtUpperCase(str, i) {
        if (str == null || i < 0 || i >= str.length) {
            return false;
        }
        var ch = str.charAt(i);
        return ch === ch.toUpperCase();
    }
    /** Check if a string is underscore case.
     * For example: isUnderscoreCase("Java_Script")
     * returns: true
     * Or example: isUnderscoreCase("case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is underscore case, false if not
     */
    function isUnderscoreCase(str) {
        var underscoreIndex = str.indexOf('_');
        if (underscoreIndex === 0) {
            throw new Error("invalid underscoreCase string starting with underscore '" + str + "'");
        }
        var isUpper = false;
        for (var i = 1, size = str.length; i < size; i++) {
            var ch = str.charAt(i);
            isUpper = (ch === ch.toUpperCase());
            if (ch !== '_' && isUpper) {
                if (str.charAt(i - 1) !== '_' && !isDigit(ch) && !isCharAtUpperCase(str, i - 1)) {
                    return false;
                }
                // read consecutive capital characters after an underscore, for example "Bid_ID" is valid because the capital "D" gets skipped
                for (; i < size; i++) {
                    ch = str.charAt(i);
                    if (ch !== ch.toUpperCase() || ch === '_') {
                        break;
                    }
                }
            }
        }
        return true;
    }
    StringCase.isUnderscoreCase = isUnderscoreCase;
    /** Convert a string from camel case or title case to underscore case
     * @param str the string to convert
     * @return the 'str' converted to underscore case if possible,
     * throws an error if the string's format is not recognized
     */
    function toUnderscoreCase(str) {
        return StringCase.toSeparatedCase(str, '_');
    }
    StringCase.toUnderscoreCase = toUnderscoreCase;
    function toSeparatedCase(str, separator) {
        var resStr = null;
        if (StringCase.isCamelCase(str)) {
            var res = [str.charAt(0).toUpperCase()];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === ch.toUpperCase()) {
                    res.push(separator);
                }
                res.push(ch);
            }
            resStr = res.join('');
        }
        else if (StringCase.isTitleCase(str)) {
            var res = [str.charAt(0)];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === ch.toUpperCase()) {
                    res.push(separator);
                }
                res.push(ch);
            }
            resStr = res.join('');
        }
        else if (StringCase.isUnderscoreCase(str)) {
            resStr = str;
        }
        else {
            throw new Error("unknown case of str '" + str + "'");
        }
        return resStr;
    }
    StringCase.toSeparatedCase = toSeparatedCase;
    /** Check if a string is title case.
     * For example: isUnderscoreCase("JavaScript")
     * returns: true
     * Or example: isUnderscoreCase("case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is title case, false if not
     */
    function isTitleCase(str) {
        var underscoreIndex = str.indexOf('_');
        if (underscoreIndex === 0) {
            throw new Error("invalid TitleCase string starting with underscore '" + str + "'");
        }
        return underscoreIndex === -1 && str.charAt(0) === str.charAt(0).toUpperCase();
    }
    StringCase.isTitleCase = isTitleCase;
    /** Convert a string from camel case or underscore case to title case
     * @param str the string to convert
     * @return the 'str' converted to title case if possible,
     * throws an error if the string's format is not recognized
     */
    function toTitleCase(str) {
        var resStr = null;
        if (StringCase.isCamelCase(str)) {
            resStr = str.charAt(0).toUpperCase() + str.substr(1);
        }
        else if (StringCase.isTitleCase(str)) {
            resStr = str;
        }
        else if (StringCase.isUnderscoreCase(str)) {
            var res = [str.charAt(0).toUpperCase()];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === '_') {
                    if (i < size - 1) {
                        res.push(str.charAt(i + 1));
                        i++;
                    }
                }
                else {
                    res.push(ch);
                }
            }
            resStr = res.join('');
        }
        else {
            throw new Error("unknown case of str '" + str + "'");
        }
        return resStr;
    }
    StringCase.toTitleCase = toTitleCase;
    /** Check if a string is camel case.
     * For example: isUnderscoreCase("javaScript")
     * returns: true
     * Or example: isUnderscoreCase("Case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is camel case, false if not
     */
    function isCamelCase(str) {
        var underscoreIndex = str.indexOf('_');
        if (underscoreIndex === 0) {
            throw new Error("invalid camelCase string starting with underscore '" + str + "'");
        }
        return underscoreIndex === -1 && str.charAt(0) !== str.charAt(0).toUpperCase();
    }
    StringCase.isCamelCase = isCamelCase;
    /** Convert a string from title case or underscore case to camel case
     * @param str the string to convert
     * @return the 'str' converted to camel case if possible,
     * throws an error if the string's format is not recognized
     */
    function toCamelCase(str) {
        var resStr = null;
        if (StringCase.isCamelCase(str)) {
            resStr = str;
        }
        else if (StringCase.isTitleCase(str)) {
            resStr = str.charAt(0).toLowerCase() + str.substr(1);
        }
        else if (StringCase.isUnderscoreCase(str)) {
            var res = [str.charAt(0).toLowerCase()];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === '_') {
                    if (i < size - 1) {
                        res.push(str.charAt(i + 1));
                        i++;
                    }
                }
                else {
                    res.push(ch);
                }
            }
            resStr = res.join('');
        }
        else {
            throw new Error("unknown case of str '" + str + "'");
        }
        return resStr;
    }
    StringCase.toCamelCase = toCamelCase;
})(StringCase || (StringCase = {}));
module.exports = StringCase;
