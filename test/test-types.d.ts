/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />

interface LogFunc {
    (...msgs: any[]): void;
}


interface Logger {

    log(...msgs: any[]): void;

}