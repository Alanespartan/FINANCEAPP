import { filterNonNullableAttributes } from "@backend/utils/functions";
import { UpdateLoanPayload } from "@common/types/loans";
import { TPayFrequency } from "@common/types/util";
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
        * @param {string | number} toSearch Loan name or id to search for
        * @param {string} field Type field to search for (name or id)
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasLoan(this: User, toSearch: string | number, field: string): boolean {
            switch (field) {
                case "name": return this.loans.find((l) => l.name === (toSearch as string)) ? true : false;
                case "id": return this.loans.find((l) => l.id === (toSearch as number)) ? true : false;
                default: return false;
            }
        }
        /**
        * Get a specific stored loan using its db id. Use hasLoan() first for safety check.
        * @param {number} toSearch Loan id to search for
        * @returns {Loan} The desired loan object
        */
        public getLoanById(this: User, toSearch: number): Loan {
            return this.loans.find((l) => l.id === toSearch) as Loan;
        }
        /**
        * Get a specific stored loan using its name. Use hasLoan() first for safety check.
        * @param {string | number} toSearch Loan name to search for
        * @returns {Loan} The desired loan object
        */
        public getLoanByName(this: User, toSearch: string): Loan {
            return this.loans.find((l) => l.name === toSearch) as Loan;
        }
        /**
        * Get all stored user loans.
        * @return {Loan[]} User loans array
        */
        public getLoans(this: User): Loan[] {
            return this.loans;
        }
        /**
        * Get a desired stored loan and update its attributes using a given set of options.
        * @param {number} id Loan id used to retrieve object from user data
        * @param {UpdateLoanPayload} options Object containing the new values to assign
        * @returns {Loan} Updated loan object
        */
        public setOptionsIntoLoan(this: User, id: number, options: UpdateLoanPayload): Loan {
            // javascript handles objects by reference, by updating the loan object here we dont need to update it in the endpoint
            const toUpdate = this.getLoanById(id);

            // build payload from non null/undefined options
            const payload = filterNonNullableAttributes(options);
            // apply the new values from given options into desired loan
            Object.entries(payload).forEach(([ key, value ]) => {
                if(key in toUpdate) {
                    switch (key) {
                        case "name":               toUpdate.name               = value as string; break;
                        case "expires":            toUpdate.expires            = value as number; break;
                        case "borrowed":           toUpdate.borrowed           = value as number; break;
                        case "fixedPaymentAmount": toUpdate.fixedPaymentAmount = value as number; break;
                        case "interestsToPay":     toUpdate.interestsToPay     = value as number; break;
                        case "annualInterestRate": toUpdate.annualInterestRate = value as number; break;
                        case "isFinished":         toUpdate.isFinished         = value as boolean; break;
                        case "archived":           toUpdate.archived           = value as boolean; break;
                        case "payFrequency":       toUpdate.payFrequency       = value as TPayFrequency; break;
                    }
                }
            });

            return toUpdate;
        }
    };
};
