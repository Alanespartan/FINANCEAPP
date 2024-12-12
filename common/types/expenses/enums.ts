/** Object Enum representing all the possible expense types the application can manipulate. */
export const OETypesOfExpense = {
    ALL:         0,
    /** If what you are paying is a real expense (e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming) */
    REALEXPENSE: 1,
    /** If what you are paying is a card */
    CARD:        2,
    /** If what you are paying is a loan */
    LOAN:        3
} as const;
