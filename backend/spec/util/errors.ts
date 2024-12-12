/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";

/** Utility function to validate a response is 400 - Bad Request Error */
export function expectBadRequestError(error: any, message: string) {
    expect(error).to.have.property("status", "error");
    expect(error).to.have.property("message", "The server did not understand the request or could not read the request body.");
    expect(error).to.have.property("info", message);
}
/** Utility function to validate a response is 404 - Not Found Error */
export function expectNotFoundError(error: any, message: string) {
    expect(error).to.have.property("status", "error");
    expect(error).to.have.property("message", "The requested resource could not be found.");
    expect(error).to.have.property("info", message);
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
