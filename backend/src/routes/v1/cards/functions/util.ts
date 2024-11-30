/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCardFilters, TCardTypes, OECardTypesFilters, UpdateCardPayload }   from "@common/types/cards";

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
