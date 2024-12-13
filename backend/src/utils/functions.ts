import { TPayFrequency, OEPayFrequency } from "@common/types/util";

/**
 * Breaks an array into multiple smaller arrays.
 * @param  {T[]} array Array to split.
 * @param  {number} chunkSize Size of each chunk.
 * @returns Array of the segments of the original array.
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    if(chunkSize === 1) { return array.map((value) => [ value ]); }

    const chunks: T[][] = new Array(Math.ceil(array.length / chunkSize));
    let artIndex = 0;
    let chunkIndex = -1;
    while(artIndex < array.length) {
        const remaining = array.length - artIndex;
        chunks[++chunkIndex] = new Array(Math.min(chunkSize, remaining));
        for(let i = 0; i < chunkSize && artIndex < array.length; i++) {
            chunks[chunkIndex][i] = array[artIndex++];
        }
    }
    return chunks;
}

export function ConvertToUTCTimestamp(date?: string | Date | number) {
    const toUTC = date ? new Date(date) : new Date();
    return Date.UTC(
        toUTC.getUTCFullYear(),
        toUTC.getUTCMonth(),
        toUTC.getUTCDate(),
        toUTC.getUTCHours(),
        toUTC.getUTCMinutes(),
        toUTC.getUTCSeconds(),
        toUTC.getUTCMilliseconds()
    ); // Returns the timestamp in UTC
}

/** Validates the given id in string format is a positive integer. */
export function stringIsValidID(stringId: string) {
    return /^[1-9]\d*$/.test(stringId);
}

/** Validates the given string is a number either positive or negative and with or without decimal numbers. */
export function stringIsValidNumber(stringId: string) {
    return /^[+-]?\d+(\.\d+)?$/.test(stringId);
}

export const isValidPayFrequency = (value: number): value is TPayFrequency => {
    return value === OEPayFrequency.SemiWeekly
        || value === OEPayFrequency.Weekly
        || value === OEPayFrequency.SemiMonthly
        || value === OEPayFrequency.Monthly;
};
