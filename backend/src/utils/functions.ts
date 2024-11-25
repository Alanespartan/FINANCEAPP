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

export function ConvertToUTCTimestamp(date?: string | Date) {
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
