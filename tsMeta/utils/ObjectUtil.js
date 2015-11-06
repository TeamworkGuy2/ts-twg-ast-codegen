"use strict";
/**
 * @since 2015-8-9
 */
var ObjectUtil;
(function (ObjectUtil) {
    function values(obj, keys) {
        if (keys != null && !Array.isArray(keys)) {
            throw new Error("keys array is not an array");
        }
        if (keys == null) {
            keys = Object.keys(obj);
        }
        var vals = new Array(i);
        for (var i = 0, size = keys.length; i < size; i++) {
            vals[i] = obj[keys[i]];
        }
        return vals;
    }
    ObjectUtil.values = values;
    function valuesNotNull(obj, keys) {
        if (keys != null && !Array.isArray(keys)) {
            throw new Error("keys array is not an array");
        }
        if (keys == null) {
            keys = Object.keys(obj);
        }
        var vals = [];
        for (var i = 0, size = keys.length; i < size; i++) {
            var prop = obj[keys[i]];
            if (prop != null) {
                vals.push(prop);
            }
        }
        return vals;
    }
    ObjectUtil.valuesNotNull = valuesNotNull;
    function hasAnyNonNullProps(obj, propNames) {
        return hasMatchingProps(obj, propNames, function (val) { return val != null; }, propNames != null ? 1 : 0);
    }
    ObjectUtil.hasAnyNonNullProps = hasAnyNonNullProps;
    function hasNonNullProps(obj, propNames) {
        return hasMatchingProps(obj, propNames, function (val) { return val != null; }, propNames != null ? propNames.length : 0);
    }
    ObjectUtil.hasNonNullProps = hasNonNullProps;
    function hasMatchingProps(obj, propNames, template_condition, requiredMatches) {
        if (requiredMatches === void 0) { requiredMatches = (propNames != null ? propNames.length : 0); }
        if (obj == null) {
            return false;
        }
        if (!Array.isArray(propNames)) {
            throw new Error("property names array is not an array");
        }
        var nonNullCount = 0;
        for (var i = 0, size = propNames.length; i < size; i++) {
            var propName = propNames[i];
            if (obj.hasOwnProperty(propName) && template_condition(obj[propName]) === true) {
                nonNullCount++;
                if (nonNullCount >= requiredMatches) {
                    return true;
                }
            }
            else if (i - nonNullCount >= size - requiredMatches) {
                break;
            }
        }
        return false;
    }
    ObjectUtil.hasMatchingProps = hasMatchingProps;
    /** Copy properties from {@code parent} to {@code child}, mimics child extending parent.
     * The child object's prototype is modified by this function call.
     * @param {Object} child  the object that inherits from {@code parent}
     * @param {Object} parent  the parent object
     * @param {boolean} childOverrides  true to preserve existing {@code child} properties, false to
     * overwrite child properties with parent properties when parent and child have properties with the same name
     */
    function extend(child, parent, childOverrides) {
        if (childOverrides === void 0) { childOverrides = true; }
        if (parent.prototype == null) {
            throw new Error(parent + ", does not have a prototype");
        }
        var childPrototype = child.prototype;
        var newChildPrototype = Object.create(parent.prototype);
        child.prototype = newChildPrototype;
        for (var prop in childPrototype) {
            if (childPrototype.hasOwnProperty(prop)) {
                if (!childOverrides || !newChildPrototype.hasOwnProperty(prop)) {
                    newChildPrototype[prop] = childPrototype[prop];
                }
            }
        }
        Object.defineProperty(child.prototype, "constructor", {
            value: child
        });
    }
    ObjectUtil.extend = extend;
    /** Modify {@code child} to extend {@code parent} by copying prototype properties
     * The child object's prototype is modified by this function call.
     * @param {Object} child  the object that inherits from {@code parent}
     * @param {Object} parent  the parent object
     * @param {boolean} childOverrides  true to preserve existing {@code child} properties, false to
     * overwrite child properties with parent properties when parent and child have properties with the same name,
     * also see below {@code throwOverwriteError}
     * @param {boolean} throwOverwriteError  true to throw an error if {@code parent} has properties that overwrite
     * properties in {@code child}, false to keep child properties
     */
    function extendToStatic(child, parent, childOverrides, throwOverwriteError) {
        if (childOverrides === void 0) { childOverrides = true; }
        if (throwOverwriteError === void 0) { throwOverwriteError = true; }
        var parentPrototype = parent.prototype;
        for (var prop in parentPrototype) {
            if (parentPrototype.hasOwnProperty(prop)) {
                if (childOverrides && child.hasOwnProperty(prop)) {
                    if (throwOverwriteError) {
                        throw new Error("child object '" + child + "' already has a property named '" + prop + "', cannot inherit from parent object '" + parent + "'");
                    }
                }
                else {
                    child[prop] = parent[prop];
                }
            }
        }
    }
    ObjectUtil.extendToStatic = extendToStatic;
})(ObjectUtil || (ObjectUtil = {}));
module.exports = ObjectUtil;
