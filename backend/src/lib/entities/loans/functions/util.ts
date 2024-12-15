/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CreateLoanPayload, CreateLoanRequiredKeys,
    UpdateLoanPayload, UpdateLoanOptionalKeys
} from "@common/types/loans";
import { ConvertToUTCTimestamp, isValidPayFrequency } from "@backend/utils/functions";
import { getBank  } from "@entities/cards/functions/db";
import { BadRequestError, ServerError } from "@errors";
import { User } from "@entities";

/**
* @param {string} toSaveName Its the loan to create/update name, used for customizing error messages if needed
* @throws BadRequestError if invalid parameter value is found
* @throws ServerError if developer makes a mistake invoking the function
*/
export async function RunPayloadsParamsChecks(user: User, body: CreateLoanPayload | UpdateLoanPayload, action: string, toSaveName: string) {
    let options;
    let actionMessage;

    // check parameters present only in certain type of payload
    if(action === "create") {
        options = body as CreateLoanPayload;
        actionMessage = "created";

        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Loan "${options.name}" cannot be ${actionMessage} because an incorrect bank id was used in the request: ${options.bankId}.`);
        }
    } else if(action === "update") {
        options = body as UpdateLoanPayload;
        actionMessage = "updated";

        // ANALYZE HERE ANY NEW ATTRIBUTE ADDED TO THE UPDATE INTERFACE THAT DOES NOT APPEAR IN CREATE INTERFACE
    } else {
        throw new ServerError("An error occurred while analyzing loan request payload.");
    }

    // check parameters found in both payloads (creation and update)
    options = body;

    // avoid creating a duplicate if a loan with the given loan number already exists
    if(options.name) {
        if(user.hasLoan(options.name, "name")) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because one with that name already exists.`);
        }
    }

    // validate loan expiration date is correct
    if(options.expires) {
        // using UTC function for correct timestamp comparision
        if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because expiration date "${options.expires}" can't be less than today's date.`);
        }
    }

    // validate borrowed value is correct
    if(options.borrowed) {
        if(options.borrowed <= 0) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because an incorrect "borrowed" value was used in the request: ${options.borrowed}.`);
        }
    }

    // validate fixed payment amount value is correct
    if(options.fixedPaymentAmount) {
        if(options.fixedPaymentAmount <= 0) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because an incorrect "fixedPaymentAmount" value was used in the request: ${options.fixedPaymentAmount}.`);
        }
    }

    // validate interests to pay value is correct
    if(options.interestsToPay) {
        if(options.interestsToPay <= 0) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because an incorrect "interestsToPay" value was used in the request: ${options.fixedPaymentAmount}.`);
        }
        // interests debt can't be greater than borrowed money
        if(options.borrowed && options.interestsToPay > options.borrowed) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because interests debt "${options.interestsToPay}" can't be greater than borrowed "${options.borrowed}" money.`);
        }
    }

    // validate annual interest rate value is correct
    if(options.annualInterestRate) {
        if(options.annualInterestRate <= 0) {
            throw new BadRequestError(`Loan "${toSaveName}" cannot be ${actionMessage} because an incorrect "annualInterestRate" value was used in the request: ${options.annualInterestRate}.`);
        }
    }

    // validate pay frequency value is correct
    if(options.payFrequency) {
        // THIS IS VALIDATED IN verifyCreateLoanBody AND verifyUpdateLoanBody FUNCTIONS
    }
}

/**
 * Ensures body is in correct format and all required parameters are present to create a loan.
 * @param {unknown} body Body from create loan request.
 * @returns bodyisCreateLoanPayload wheter or not the body is valid
 */
export function VerifyCreateLoanBody(body: unknown): body is CreateLoanPayload {
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
export function VerifyUpdateLoanBody(body: unknown): body is UpdateLoanPayload {
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
