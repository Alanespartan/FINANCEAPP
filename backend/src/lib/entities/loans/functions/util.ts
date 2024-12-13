/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CreateLoanPayload, CreateLoanRequiredKeys,
    UpdateLoanPayload, UpdateLoanOptionalKeys
} from "@common/types/loans";
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

    // Check if all required keys exist and have valid types
    for(const key of CreateLoanRequiredKeys) {
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
*/
export function verifyUpdateLoanBody(body: unknown): body is UpdateLoanPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    // Validate optional fields
    for(const key of UpdateLoanOptionalKeys) {
        const value = (body as Record<string, unknown>)[key];
        if(value !== undefined) {
            switch (key) {
                case "name":
                    if(typeof value !== "string") return false;
                    break;
                case "expires":
                case "borrowed":
                case "fixedPaymentAmount":
                case "interestsToPay":
                case "annualInterestRate":
                    if(typeof value !== "number") return false;
                    break;
                case "isFinished":
                case "archived":
                    if(typeof value !== "boolean") return false;
                    break;
                case "payFrequency":
                    if(typeof value !== "number" || !isValidPayFrequency(value)) return false; // Check is number but also a valid entry in TPayFrequency numeric enum
                    break;
                default: return false; // Unexpected key found
            }
        }
    }

    return true;
}
