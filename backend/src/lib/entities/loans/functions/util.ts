/* eslint-disable @typescript-eslint/no-explicit-any */

/** Helper function to remove null|undefined attributes from given card update options. */
export function filterNonNullableAttributes(options: any) {
    // Create a new object with only defined keys
    return Object.entries(options).reduce((acc, [ key, value ]) => {
        if(value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
}
