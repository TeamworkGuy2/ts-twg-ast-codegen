"use strict";
var ObjectUtil = require("./ObjectUtil");
var EnumUtil;
(function (EnumUtil) {
    var EnumClassImpl = (function () {
        function EnumClassImpl(enumClass, enumConstantClass, enumConstants) {
            this.enumClass = enumClass;
            this.enumConstantClass = enumConstantClass;
            this.enumConstants = enumConstants;
        }
        EnumClassImpl.prototype.isInstance = function (obj) {
            return obj != null && (obj.constructor != null &&
                ((obj.constructor.name === this.enumConstantClass.name) || (obj instanceof this.enumConstantClass)));
        };
        EnumClassImpl.prototype.values = function () {
            return this.enumConstants;
        };
        EnumClassImpl.prototype.parse = function (name) {
            var enumVal = null;
            if (this.enumClass.hasOwnProperty(name)) {
                enumVal = this.enumClass[name];
            }
            if (enumVal === null) {
                throw new Error("enum constant '" + name + "' is not a member of enum '" + this.enumClass + "'");
            }
            return enumVal;
        };
        return EnumClassImpl;
    })();
    EnumUtil.EnumClassImpl = EnumClassImpl;
    var EnumConstantImpl = (function () {
        function EnumConstantImpl(name) {
            this._name = name;
        }
        EnumConstantImpl.prototype.name = function () {
            return this._name;
        };
        EnumConstantImpl.prototype.toString = function () {
            return this._name;
        };
        return EnumConstantImpl;
    })();
    EnumUtil.EnumConstantImpl = EnumConstantImpl;
    function initEnumConst(enumConst, name) {
        EnumConstantImpl.call(enumConst, name);
    }
    EnumUtil.initEnumConst = initEnumConst;
    function initEnumClass(enumClass, enumConstantClass, enumConstants) {
        EnumClassImpl.call(enumClass, enumClass, enumConstantClass, enumConstants);
        ObjectUtil.extendToStatic(enumClass, EnumClassImpl, false);
        ObjectUtil.extend(enumClass, EnumConstantImpl, false);
    }
    EnumUtil.initEnumClass = initEnumClass;
})(EnumUtil || (EnumUtil = {}));
module.exports = EnumUtil;
