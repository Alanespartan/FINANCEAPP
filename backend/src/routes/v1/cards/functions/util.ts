/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload, CreateCardPayload }   from "@common/types/cards";

/**
 * Ensures create card body is in correct format and all required information is present.
 * @param {unknown} body Body from create card request.
 * @returns bodyisCreateCardPayload wheter or not the body is valid
 */
export function verifyCreateCardBody(body: unknown): body is CreateCardPayload {
    if(typeof body !== "object") { return false; }
    if(!body) { return false; }
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
