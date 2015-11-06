"use strict";

/**
 * @since 2015-8-9
 */
module ObjectUtil {

    export function values(obj: any, keys?: string[]): any[] {
        if (keys != null && !Array.isArray(keys)) {
            throw new Error("keys array is not an array");
        }
        if (keys == null) {
            keys = Object.keys(obj);
        }

        var vals: any[] = new Array(i);
        for (var i = 0, size = keys.length; i < size; i++) {
            vals[i] = obj[keys[i]];
        }
        return vals;
    }


    export function valuesNotNull(obj: any, keys?: string[]): any[] {
        if (keys != null && !Array.isArray(keys)) {
            throw new Error("keys array is not an array");
        }
        if (keys == null) {
            keys = Object.keys(obj);
        }

        var vals: any[] = [];
        for (var i = 0, size = keys.length; i < size; i++) {
            var prop = obj[keys[i]];
            if (prop != null) {
                vals.push(prop);
            }
        }
        return vals;
    }


    export function hasAnyNonNullProps(obj: any, propNames: string[]): boolean {
        return hasMatchingProps(obj, propNames, (val) => val != null, propNames != null ? 1 : 0);
    }


    export function hasNonNullProps(obj: any, propNames: string[]): boolean {
        return hasMatchingProps(obj, propNames, (val) => val != null, propNames != null ? propNames.length : 0);
    }


    export function hasMatchingProps(obj: any, propNames: string[], template_condition: (propVal) => boolean, requiredMatches: number = (propNames != null ? propNames.length : 0)): boolean {
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
            // if enough properties fail to match that even if all the rest match the required count could be reached, break out of the loop
            else if (i - nonNullCount >= size - requiredMatches) {
                break;
            }
        }
        return false;
    }


    /** Copy properties from {@code parent} to {@code child}, mimics child extending parent.
     * The child object's prototype is modified by this function call.
     * @param {Object} child  the object that inherits from {@code parent}
     * @param {Object} parent  the parent object
     * @param {boolean} childOverrides  true to preserve existing {@code child} properties, false to
     * overwrite child properties with parent properties when parent and child have properties with the same name
     */
    export function extend(child: any, parent: any, childOverrides: boolean = true): void {
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
    export function extendToStatic(child: any, parent: any, childOverrides: boolean = true, throwOverwriteError: boolean = true): void {
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

}

export = ObjectUtil;
