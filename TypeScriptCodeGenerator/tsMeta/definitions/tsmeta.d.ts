/// <reference path="./cstypes.d.ts" />
/// <reference path="./types.d.ts" />
/// <reference path="./utils.d.ts" />

declare module 'fs' {
    export function readFile(...args: any[]): any;
}

declare module 'vm' { }

declare module 'gulp' {
    export function dest(...args: any[]): any;
    export function task(...args: any[]): any;
}

declare module 'gulp-util' {
    export var env: {};
    export function log(...args: any[]): any;
}

declare module 'gulp-concat' { }

declare module 'gulp-sass' { }

declare module 'gulp-minify-css' { }

declare module 'gulp-rename' {
    function gulpRename(...args: any[]): any;
    export = gulpRename;
}

declare module 'gulp-uglify' { }

declare module 'browserify' { }

declare module 'watchify' {
    function watchify(...args: any[]): any;
    export = watchify;
}

declare module 'es6ify' {
    export function configure(...args: any[]): any;
    export var traceurOverrides: any;
}

declare module 'reactify' { }

declare module 'vinyl-source-stream' {
    function vinylSourceStream(...args: any[]): any;
    export = vinylSourceStream;
}

declare module 'gulp-6to5' { }

declare module 'q' { }

declare module 'child_process' {
    export var exec: any;
}

declare module 'exorcist' {
    function exorcist(...args: any[]): any;
    export = exorcist;
}
