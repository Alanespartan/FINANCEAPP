export function formatDate(dateString: string) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year:  'numeric',
        month: 'short', // 3-letter abbreviation of the month
        day:   'numeric'
    };

    return date.toLocaleDateString(undefined, options);
}
