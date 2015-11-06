"use strict";
import TestUtil = require("./tests/TestUtil");
import StringUtilTest = require("./tests/utils/StringUtilTest");

module Tests {

    export function getAllTestModules(): any[] {
        return [
            StringUtilTest
        ];
    }


    export function runAll(log?: LogFunc) {
        var testObjs = getAllTestModules();
        for (var i = 0, size = testObjs.length; i < size; i++) {
            var testObj = testObjs[i];
            TestUtil.runTestFunctions(log, TestUtil.findTestFunctions(testObj));
        }
    }

}

export = Tests;