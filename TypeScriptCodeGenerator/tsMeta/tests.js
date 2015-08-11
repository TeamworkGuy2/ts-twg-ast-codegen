"use strict";
var TestUtil = require("./tests/TestUtil");
var StringUtilTest = require("./tests/utils/StringUtilTest");
var Tests;
(function (Tests) {
    function getAllTestModules() {
        return [
            StringUtilTest
        ];
    }
    Tests.getAllTestModules = getAllTestModules;
    function runAll(log) {
        var testObjs = getAllTestModules();
        for (var i = 0, size = testObjs.length; i < size; i++) {
            var testObj = testObjs[i];
            TestUtil.runTestFunctions(log, TestUtil.findTestFunctions(testObj));
        }
    }
    Tests.runAll = runAll;
})(Tests || (Tests = {}));
module.exports = Tests;
