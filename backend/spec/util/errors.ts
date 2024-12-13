/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";

function isValidError(error: any, message: string, infoMesage: string) {
    expect(error).to.have.property("status", "error");
    expect(error).to.have.property("message", message);
    expect(error).to.have.property("info", infoMesage);
}

/** Utility function to validate a response is 400 - Bad Request Error */
export function expectBadRequestError(error: any, infoMessage: string) {
    isValidError(error, "The server did not understand the request or could not read the request body.", infoMessage);
}
/** Utility function to validate a response is 404 - Not Found Error */
export function expectNotFoundError(error: any, infoMessage: string) {
    isValidError(error, "The requested resource could not be found.", infoMessage);
}
export function expectUnauthorizedError() {
    //
}
export function expectForbiddenError() {
    //
}
export function expectResourceGoneError() {
    //
}
