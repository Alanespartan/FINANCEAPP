/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateLoanPayload } from "@common/types/loans";
import { isValidPayFrequency } from "@backend/utils/functions";

/**
 * Ensures body is in correct format and all required information is present to create a loan.
 * @param {unknown} body Body from create loan request.
 * @returns bodyisCreateLoanPayload wheter or not the body is valid
 */
export function verifyCreateLoanBody(body: unknown): body is CreateLoanPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    const requiredKeys: (keyof CreateLoanPayload)[] = [ "name", "expires", "payFrequency", "borrowed", "fixedPaymentAmount", "interestsToPay", "annualInterestRate", "bankId" ];

    // Check if all required keys exist and have valid types
    for(const key of requiredKeys) {
        const value = (body as Record<string, unknown>)[key];

        switch (key) {
            case "name":
                if(typeof value !== "string") return false;
                break;
            case "expires":
            case "borrowed":
            case "fixedPaymentAmount":
            case "interestsToPay":
            case "annualInterestRate":
            case "bankId":
                if(typeof value !== "number") return false;
                break;
            case "payFrequency":
                if(typeof value !== "number" || !isValidPayFrequency(value)) return false; // Check is number but also a valid entry in TPayFrequency numeric enum
                break;
            default:
                return false; // Unexpected key found
        }
    }

    return true;
}

/**
 * Ensures body is in correct format and all required information is present to update a loan.
 * @param {unknown} body Body from update loan request.
 * @returns bodyisUpdateLoanPayload wheter or not the body is valid

export function verifyUpdateLoanBody(body: unknown): body is UpdateLoanPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed = body as UpdateLoanPayload;
    let count = 0;
    if(parsed.loanNumber) { count++; if(typeof parsed.loanNumber !== "string") { return false; } }
    if(parsed.name)       { count++; if(typeof parsed.name !== "string")       { return false; } }
    if(parsed.limit)      { count++; if(typeof parsed.limit !== "number")      { return false; } }
    if(parsed.type)       { count++; if(typeof parsed.type !== "number")       { return false; } }
    if(parsed.expires)    { count++; if(typeof parsed.expires !== "number")    { return false; } }
    if(parsed.archived)   { count++; if(typeof parsed.archived !== "boolean")  { return false; } }
    if(parsed.isVoucher)  { count++; if(typeof parsed.isVoucher !== "boolean") { return false; } }
    if(count === 0) { return false; } // if obj has keys but none is from update loan payload interface

    return true;
} */
