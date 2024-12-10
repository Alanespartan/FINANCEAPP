import { MixinsConstructor, Loan, User } from "@entities";

export const LoansMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /**
        * Save a new loan in user array.
        * @param {Loan} toAdd New Loan object to save in user array
        */
        public addLoan(this: User, toAdd: Loan): void {
            this.loans.push(toAdd);
        }
        /**
        * Checks if a loan exists in user data.
        * @param {string} toSearch Loan name to search for
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasLoan(this: User, toSearch: string): boolean {
            return this.loans.find((l) => l.name === toSearch) ? true : false;
        }
        /**
        * Get a specific stored loan using its name to search for it. Use hasLoan() first for safety check.
        * @param {string} toSearch Loan name to search for
        * @returns {Loan} The desired Loan object
        */
        public getLoan(this: User, toSearch: string): Loan {
            return this.loans.find((l) => l.name === toSearch) as Loan;
        }
        /**
        * Get all stored user loans.
        * @returns {Loan[]} User loans array
        */
        public getLoans(this: User): Loan[] {
            return this.loans;
        }
    };
};
