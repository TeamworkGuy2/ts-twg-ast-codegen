
/** Check if a string conforms to a programming naming convention,
 * such as TitleCase, camelCase, or Under_Score_Case.
 * @author TeamworkGuy2
 */
module StringCase {

    /** Check if a string is underscore case.
     * For example: isUnderscoreCase("Java_Script")
     * returns: true
     * Or example: isUnderscoreCase("case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is underscore case, false if not
     */
    export function isUnderscoreCase(str: string): boolean {
        var isUpper = false;
        for (var i = 1, size = str.length; i < size; i++) {
            var ch = str.charAt(i);
            isUpper = (ch === ch.toUpperCase());
            if (ch !== '_' && isUpper) {
                if (str.charAt(i - 1) !== '_' && !isDigit(str, i) && !isCharAtUpperCase(str, i - 1)) {
                    return false;
                }
                // read consecutive capital characters after an underscore, for example "My_ID" is valid because the capital "D" gets skipped
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


    /** Convert a string from camel case or title case to underscore case
     * @param str the string to convert
     * @return the 'str' converted to underscore case if possible,
     * throws an error if the string's format is not recognized
     */
    export function toUnderscoreCase(str: string): string {
        return toSeparatedCase(str, '_');
    }


    export function toSeparatedCase(str: string, separator: string): string {
        if (isCamelCase(str)) {
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
        else if (isTitleCase(str)) {
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
        else if (isUnderscoreCase(str)) {
            return str;
        }
        else {
            throw new Error("unknown string casing for '" + str + "'");
        }
    }


    /** Check if a string is title case.
     * For example: isUnderscoreCase("JavaScript")
     * returns: true
     * Or example: isUnderscoreCase("case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is title case, false if not
     */
    export function isTitleCase(str: string): boolean {
        var underscoreIdx = str.indexOf('_');
        var ch0: string;
        return underscoreIdx === -1 && (ch0 = str.charAt(0)) === ch0.toUpperCase();
    }


    /** Convert a string from camel case or underscore case to title case
     * @param str the string to convert
     * @return the 'str' converted to title case if possible,
     * throws an error if the string's format is not recognized
     */
    export function toTitleCase(str: string): string {
        if (isCamelCase(str)) {
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
        else if (isTitleCase(str)) {
            return str;
        }
        else if (isUnderscoreCase(str)) {
            var res = str.charAt(0).toUpperCase();
            for (var i = 1, size = str.length; i < size; i++) {
                var ch = str.charAt(i);
                if (ch === '_') {
                    if (i < size - 1) {
                        res += str.charAt(i + 1);
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


    /** Check if a string is camel case.
     * For example: isUnderscoreCase("javaScript")
     * returns: true
     * Or example: isUnderscoreCase("Case")
     * returns: false
     * @param str the string to check
     * @param true if 'str' is camel case, false if not
     */
    export function isCamelCase(str: string): boolean {
        var underscoreIdx = str.indexOf('_');
        var ch0: string;
        return underscoreIdx === -1 && (ch0 = str.charAt(0)) !== ch0.toUpperCase();
    }


    /** Convert a string from title case or underscore case to camel case
     * @param str the string to convert
     * @return the 'str' converted to camel case if possible,
     * throws an error if the string's format is not recognized
     */
    export function toCamelCase(str: string): string {
        if (isCamelCase(str)) {
            return str;
        }
        else if (isTitleCase(str)) {
            return str.charAt(0).toLowerCase() + str.substr(1);
        }
        else if (isUnderscoreCase(str)) {
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
            return res.join('');
        }
        else {
            throw new Error("unknown string casing for '" + str + "'");
        }
    }


    /** Test if a character in a string is are digit
     * @param string: the character to check
     * @param idx: the string index
     * @return true if the specified character in the string is a digit ['0'-'9'], false if not
     */
    function isDigit(str: string, idx: number): boolean {
        var ch = str.charCodeAt(idx) - 48;
        return (ch >= 0 && ch <= 9);
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
    function isCharAtUpperCase(str: string, i: number): boolean {
        if (str == null || i < 0 || i >= str.length) {
            return false;
        }
        var ch = str.charAt(i);
        return ch === ch.toUpperCase();
    }

}

export = StringCase;
