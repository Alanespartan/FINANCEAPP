/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload, CreateCardPayload } from "@common/types/cards";

/**
 * Ensures body is in correct format and all required information is present to create a card.
 * @param {unknown} body Body from create card request.
 * @returns bodyisCreateCardPayload wheter or not the body is valid
 */
export function verifyCreateCardBody(body: unknown): body is CreateCardPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed         = body as CreateCardPayload;
    const validName      = parsed.name      ? typeof parsed.name      === "string"  ? true : false : true;
    const validLimit     = parsed.limit     ? typeof parsed.limit     === "number"  ? true : false : true;
    const validIsVoucher = parsed.isVoucher ? typeof parsed.isVoucher === "boolean" ? true : false : true;

    return typeof parsed.cardNumber === "string"
        && typeof parsed.type       === "number"
        && typeof parsed.bankId     === "number"
        && typeof parsed.balance    === "number"
        && typeof parsed.expires    === "string"
        && validName && validLimit && validIsVoucher;
}

/**
 * Ensures body is in correct format and all required information is present to update a card.
 * @param {unknown} body Body from update card request.
 * @returns bodyisUpdateCardPayload wheter or not the body is valid
 */
export function verifyUpdateCardBody(body: unknown): body is UpdateCardPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed = body as UpdateCardPayload;
    let count = 0;
    if(parsed.cardNumber) { count++; if(typeof parsed.cardNumber !== "string") { return false; } }
    if(parsed.name)       { count++; if(typeof parsed.name !== "string")       { return false; } }
    if(parsed.limit)      { count++; if(typeof parsed.limit !== "number")      { return false; } }
    if(parsed.type)       { count++; if(typeof parsed.type !== "number")       { return false; } }
    if(parsed.expires)    { count++; if(typeof parsed.expires !== "number")    { return false; } }
    if(parsed.archived)   { count++; if(typeof parsed.archived !== "boolean")  { return false; } }
    if(parsed.isVoucher)  { count++; if(typeof parsed.isVoucher !== "boolean") { return false; } }
    if(count === 0) { return false; } // if obj has keys but none is from update card payload interface

    return true;
}

export const isValidCardFilter = (value: number): value is TCardFilters => {
    return value === OECardTypesFilters.ALL
        || value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

export const isValidCardType = (value: number): value is TCardTypes => {
    return value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

/** Helper function to remove null|undefined attributes from given card update options. */
export function filterNonNullableAttributes(options: UpdateCardPayload) {
    // Create a new object with only defined keys
    return Object.entries(options).reduce((acc, [ key, value ]) => {
        if(value !== undefined && value !== null) {
            acc[key as keyof UpdateCardPayload] = value;
        }
        return acc;
    }, {} as any);
}
