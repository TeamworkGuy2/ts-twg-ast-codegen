"use strict";
var Modifier;
(function (Modifier) {
    Modifier[Modifier["ABSTRACT"] = 0] = "ABSTRACT";
    Modifier[Modifier["FINAL"] = 1] = "FINAL";
    Modifier[Modifier["INTERFACE"] = 2] = "INTERFACE";
    Modifier[Modifier["NATIVE"] = 3] = "NATIVE";
    Modifier[Modifier["STATIC"] = 4] = "STATIC";
    Modifier[Modifier["STRICT"] = 5] = "STRICT";
    Modifier[Modifier["SYNCHRONIZED"] = 6] = "SYNCHRONIZED";
    Modifier[Modifier["VOLATILE"] = 7] = "VOLATILE";
})(Modifier || (Modifier = {}));
(function (Modifier) {
    function publicClass() {
        return ["public", "class"];
    }
    Modifier.publicClass = publicClass;
})(Modifier || (Modifier = {}));
module.exports = Modifier;
