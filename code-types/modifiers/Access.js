"use string";
"use strict";
var Access;
(function (Access) {
    Access[Access["DEFAULT"] = 0] = "DEFAULT";
    Access[Access["INTERNAL"] = 1] = "INTERNAL";
    Access[Access["PROTECTED_INTERNAL"] = 2] = "PROTECTED_INTERNAL";
    Access[Access["PUBLIC"] = 3] = "PUBLIC";
    Access[Access["PROTECTED"] = 4] = "PROTECTED";
    Access[Access["PRIVATE"] = 5] = "PRIVATE";
})(Access || (Access = {}));
module.exports = Access;
