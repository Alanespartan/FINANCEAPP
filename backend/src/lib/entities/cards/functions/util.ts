/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload, CreateCardPayload } from "@common/types/cards";

/**
 * Ensures body is in correct format and all required information is present to create a card.
 * @param {unknown} body Body from create card request.
 * @returns bodyisCreateCardPayload wheter or not the body is valid
 */
export function VerifyCreateCardBody(body: unknown): body is CreateCardPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    const bodyOptions = Object.entries(body).map(([ key, ]) => key);

    // Check if all required keys exist and have valid types
    for(const key of bodyOptions) {
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
            case "payFrequency":
            case "bankId":
                if(typeof value !== "number") return false;
                break;
            default: return false; // Unexpected key found
        }
    }

    return true;
}

/**
 * Ensures body is in correct format and all required information is present to update a card.
 * @param {unknown} body Body from update card request.
 * @returns bodyisUpdateCardPayload wheter or not the body is valid
 */
export function VerifyUpdateCardBody(body: unknown): body is UpdateCardPayload {
    if(!body || typeof body !== "object") {
        return false; // Reject null, undefined, or non-object values
    }

    const bodyOptions = Object.entries(body).map(([ key, ]) => key);

    // Validate optional fields
    for(const key of bodyOptions) {
        const value = (body as Record<string, unknown>)[key];
        if(value !== undefined) {
            switch (key) {
                case "cardNumber":
                case "name":
                    if(typeof value !== "string") return false;
                    break;
                case "type":
                case "expires":
                case "limit":
                case "cutOffDate":
                case "paymentDate":
                    if(typeof value !== "number") return false;
                    break;
                case "isVoucher":
                case "archived":
                    if(typeof value !== "boolean") return false;
                    break;
                default: return false; // Unexpected key found
            }
        }
    }

    return true;
}

/** Helper function to check if the given value is a valid value from card filters enum. */
export const IsValidCardFilter = (value: number): value is TCardFilters => {
    return value === OECardTypesFilters.ALL
        || value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

/** Helper function to check if the given value is a valid value from card types enum. */
export const IsValidCardType = (value: number): value is TCardTypes => {
    return value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};
