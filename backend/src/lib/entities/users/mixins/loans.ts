/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Loan, MixinsConstructor } from "@entities";

export const LoansMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        public loans: Loan[] | undefined;

        public addLoan(toAdd: Loan) {
            this.loans!.push(toAdd);
        }

        public getLoans() {
            return this.loans;
        }
    };
};
