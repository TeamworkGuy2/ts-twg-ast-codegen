"use strict";
/** Check if a string conforms to a programming naming convention,
 * such as TitleCase, camelCase, or Under_Score_Case.
 * @author TeamworkGuy2
 */
var StringCase;
(function (StringCase) {
    /** Check if a string is underscore case.
     * Example: isUnderscoreCase("Java_Script")
     * returns: true
     * Example: isUnderscoreCase("case")
     * returns: false
     * @param str the string to check
     * @param separator the separator which if contained in the string indicates that the string is not camel case
     * @param true if 'str' is underscore case, false if not
     */
    function isUnderscoreCase(str, separator) {
        if (separator === void 0) { separator = '_'; }
        var prevCh = str.charAt(0);
        var isPrevUpper = false;
        var isUpper = false;
        for (var i = 1, size = str.length; i < size; i++) {
            var ch = str.charAt(i);
            isUpper = (ch === ch.toUpperCase());
            if (ch !== separator && isUpper) {
                // invalid for capital characters to appear in the middle of a string not preceeded by a separator
                if (prevCh !== separator && !isDigit(str, i) && !isPrevUpper) {
                    return false;
                }
                // read consecutive capital characters after a separator, for example "My_ID" is valid because the capital "D" gets skipped
                for (; i < size; i++) {
                    ch = str.charAt(i);
                    isUpper = ch === ch.toUpperCase();
                    if (!isUpper || ch === separator) {
                        break;
                    }
                }
            }
            prevCh = ch;
            isPrevUpper = isUpper;
        }
        return true;
    }
    StringCase.isUnderscoreCase = isUnderscoreCase;
    /** Convert a string from camel case or title case to underscore case
     * @param str the string to convert
     * @param separator (default: '_') the character which separates words, this allows you to customize from underscore casing '_' to dash casing '-' or other
     * @param capitalize whether to capitalize each letter after a separator
     * @return the 'str' converted to underscore case if possible,
     * throws an error if the string's format is not recognizable
     */
    function toUnderscoreCase(str, separator, capitalize) {
        if (separator === void 0) { separator = '_'; }
        if (capitalize === void 0) { capitalize = false; }
        return toSeparatedCase(str, separator, capitalize);
    }
    StringCase.toUnderscoreCase = toUnderscoreCase;
    /** Convert a string from camel case or title case to separated casing (underscore, dash, or other).
     * Can also clean up capitalization of an existing separated case string.
     * Example: toSeparatedCase("TheTestString", "-", false)
     * returns: "The-Test-String"
     * Example: toSeparatedCase("the-test-string", "-", true)
     * returns: "The-Test-String"
     * @param str the string to convert
     * @param separator the character which separates words, for example '_' for underscore casing or '-' for dash casing
     * @param capitalize whether to capitalize the first letter after each separator or leave as-is
     * @return the 'str' converted to separated case if possible,
     * throws an error if the string's format is not recognizable
     */
    function toSeparatedCase(str, separator, capitalize) {
        if (isCamelCase(str, separator)) {
            var ch0 = str.charAt(0);
            var prevDigit = isDigit(str, 0);
            var res = [ch0.toUpperCase()];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                var digit = isDigit(str, i);
                if (ch === ch.toUpperCase() && (!prevDigit || !digit)) {
                    res.push(separator);
                }
                res.push(ch);
                prevDigit = digit;
            }
            return res.join('');
        }
        else if (isTitleCase(str, separator)) {
            var ch0 = str.charAt(0);
            var prevDigit = isDigit(str, 0);
            var res = [ch0];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                var digit = isDigit(str, i);
                if (ch === ch.toUpperCase() && (!prevDigit || !digit)) {
                    res.push(separator);
                }
                res.push(ch);
                prevDigit = digit;
            }
            return res.join('');
        }
        else if (isUnderscoreCase(str, separator)) {
            if (capitalize) {
                var ch0 = str.charAt(0);
                var prevDigit = isDigit(str, 0);
                var prevSep = ch0 === ch0.toUpperCase() && ch0 === ch0.toLowerCase() && !prevDigit;
                var res = [ch0.toUpperCase()];
                for (var i = 1, size = str.length; i < size; i++) {
                    var ch = str.charAt(i);
                    var digit = isDigit(str, i);
                    if (ch === ch.toUpperCase() && ch === ch.toLowerCase() && (!prevDigit || !digit)) {
                        prevSep = true;
                    }
                    else {
                        if (prevSep) {
                            ch = ch.toUpperCase();
                        }
                        prevSep = false;
                    }
                    res.push(ch);
                    prevDigit = digit;
                }
                return res.join('');
            }
            else {
                return str;
            }
        }
        else {
            throw new Error("unknown string casing for '" + str + "'");
        }
    }
    StringCase.toSeparatedCase = toSeparatedCase;
    /** Check if a string is title case.
     * Example: isTitleCase("JavaScript")
     * returns: true
     * Example: isTitleCase("case")
     * returns: false
     * @param str the string to check
     * @param separator the separator which if contained in the string indicates that the string is not title case
     * @param true if 'str' is title case, false if not
     */
    function isTitleCase(str, separator) {
        if (separator === void 0) { separator = '_'; }
        var separatorIdx = str.indexOf(separator);
        var ch0;
        return separatorIdx === -1 && (ch0 = str.charAt(0)) === ch0.toUpperCase();
    }
    StringCase.isTitleCase = isTitleCase;
    /** Convert a string from camel case or underscore case to title case
     * @param str the string to convert
     * @param separator (default: '_') the character which separates words, this allows you to customize from underscore casing '_' to dash casing '-' or other
     * @return the 'str' converted to title case if possible,
     * throws an error if the string's format is not recognizable
     */
    function toTitleCase(str, separator) {
        if (separator === void 0) { separator = '_'; }
        if (isCamelCase(str, separator)) {
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
        else if (isTitleCase(str, separator)) {
            return str;
        }
        else if (isUnderscoreCase(str, separator)) {
            var res = str.charAt(0).toUpperCase();
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === separator) {
                    if (i < size - 1) {
                        res += str.charAt(i + 1).toUpperCase();
                        i++;
                    }
                }
                else {
                    res += ch;
                }
            }
            return res;
        }
        else {
            throw new Error("unknown string casing for '" + str + "'");
        }
    }
    StringCase.toTitleCase = toTitleCase;
    /** Check if a string is camel case.
     * Example: isCamelCase("javaScript")
     * returns: true
     * Example: isCamelCase("Case")
     * returns: false
     * @param str the string to check
     * @param separator the separator which if contained in the string indicates that the string is not camel case
     * @return true if 'str' is camel case, false if not
     */
    function isCamelCase(str, separator) {
        if (separator === void 0) { separator = '_'; }
        var separatorIdx = str.indexOf(separator);
        var ch0;
        return separatorIdx === -1 && (ch0 = str.charAt(0)) !== ch0.toUpperCase();
    }
    StringCase.isCamelCase = isCamelCase;
    /** Convert a string from title case or underscore case to camel case
     * @param str the string to convert
     * @param separator (default: '_') the character which separates words, this allows you to customize from underscore casing '_' to dash casing '-' or other
     * @return the 'str' converted to camel case if possible,
     * throws an error if the string's format is not recognizable
     */
    function toCamelCase(str, separator) {
        if (separator === void 0) { separator = '_'; }
        if (isCamelCase(str, separator)) {
            return str;
        }
        else if (isTitleCase(str, separator)) {
            return str.charAt(0).toLowerCase() + str.substr(1);
        }
        else if (isUnderscoreCase(str, separator)) {
            var res = [str.charAt(0).toLowerCase()];
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === separator) {
                    if (i < size - 1) {
                        res.push(str.charAt(i + 1).toUpperCase());
                        i++;
                    }
                }
                else {
                    res.push(ch);
                }
            }
            return res.join('');
        }
        else {
            throw new Error("unknown string casing for '" + str + "'");
        }
    }
    StringCase.toCamelCase = toCamelCase;
    /** Test if a character in a string is are digit
     * @param string the character to check
     * @param idx the string index
     * @return true if the specified character in the string is a digit ['0'-'9'], false if not
     */
    function isDigit(str, idx) {
        var ch = str.charCodeAt(idx) - 48;
        return (ch >= 0 && ch <= 9);
    }
})(StringCase || (StringCase = {}));
module.exports = StringCase;
