"use strict";
var TestUtil;
(function (TestUtil) {
    function runTests(compareFunc, testValues, expectedResults, func, context) {
        if (testValues.length !== expectedResults.length) {
            throw new Error("context: running code test; " + "problem: number of test values (" + testValues.length + ") does not equal number of results (" + expectedResults.length + ")");
        }
        for (var i = 0, size = testValues.length; i < size; i++) {
            var values = testValues[i];
            var expect = expectedResults[i];
            var result = func.apply(context, values);
            if ((compareFunc != null ? compareFunc(expect, result) : expect == result) != true) {
                throw new Error("run test " + (i + 1) + " of " + size + ", expected results: '" + expect + "', did not equal results: '" + result + "'");
            }
        }
    }
    TestUtil.runTests = runTests;
    function runTestFunctions(log, testFuncs) {
        var testFuncNames = Object.keys(testFuncs);
        var testCount = testFuncNames.length;
        if (log) {
            log("Running " + testCount + " tests:");
        }
        for (var i = 0, size = testCount; i < size; i++) {
            try {
                testFuncs[testFuncNames[i]](log);
            }
            catch (err) {
                err.message = "running test func '" + testFuncNames[i] + "': " + err.message;
                throw err;
            }
            if (log) {
                log("success " + (i + 1) + "/" + size, ":", testFuncNames[i]);
            }
        }
    }
    TestUtil.runTestFunctions = runTestFunctions;
    function findTestFunctions(obj) {
        var funcs = {};
        for (var key in obj) {
            var value = obj[key];
            if (typeof value === "function" && isTestFunctionDefault(key)) {
                if (funcs[key] != null) {
                    throw new Error("duplicate test function name '" + key + "'");
                }
                funcs[key] = value;
            }
        }
        return funcs;
    }
    TestUtil.findTestFunctions = findTestFunctions;
    function isTestFunctionDefault(funcName) {
        var funcUpper = funcName.toUpperCase();
        var idx = funcUpper.indexOf("TEST");
        return idx === 0 || idx === funcUpper.length - "TEST".length;
    }
    TestUtil.isTestFunctionDefault = isTestFunctionDefault;
})(TestUtil || (TestUtil = {}));
module.exports = TestUtil;
