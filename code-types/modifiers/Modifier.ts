
enum Modifier {
    ABSTRACT,
    FINAL,
    INTERFACE,
    NATIVE,
    STATIC,
    STRICT,
    SYNCHRONIZED,
    VOLATILE,
}

module Modifier {

    export function publicClass(): string[] {
        return ["public", "class"];
    }

}

export = Modifier;
