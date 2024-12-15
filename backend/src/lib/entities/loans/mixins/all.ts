import { BadRequestError } from "@errors";
import { isValidPayFrequency } from "@backend/utils/functions";
import { MixinsConstructor, Loan, Bank } from "@entities";
import { TPayFrequency } from "@common/types/util";

export const AllLoansMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** Update loan custom name.
         * @param {string} name New loan custom name to assign
         */
        public setName(this: Loan, name: string): void {
            this.name = name;
        }
        /** Update loan expiration date using a timestamp date.
         * @param {number} expires New expiration date in timestamp format to assign
         */
        public setExpirationDate(this: Loan, expires: number): void {
            this.expires = expires;
        }
        /** Update loan borrowed amount attribute.
         * @param {number} borrowed New borrowed value to assign
         */
        public setBorrowed(this: Loan, borrowed: number): void {
            this.borrowed = borrowed;
        }
        /** Update loan totalPaid amount attribute.
         * @param {number} totalPaid New totalPaid value to assign
         */
        public setTotalPaid(this: Loan, totalPaid: number): void {
            this.totalPaid = totalPaid;
        }
        /** Update loan interestsPaid amount attribute.
         * @param {number} interestsPaid New interestsPaid value to assign
         */
        public setInterestsPaid(this: Loan, interestsPaid: number): void {
            this.interestsPaid = interestsPaid;
        }
        /** Update loan annual interest rate percentage attribute.
         * @param {number} annualInterestRate New annual interest rate percentage value to assign
         */
        public setAnnualRate(this: Loan, annualInterestRate: number): void {
            this.annualInterestRate = annualInterestRate;
        }
        /** Update loan isFinished attribute.
         * @param {boolean} isFinished New isFinished value to assign
         */
        public setIsFinished(this: Loan, isFinished: boolean): void {
            this.isFinished = isFinished;
        }
        /** Update loan archived attribute.
         * @param {boolean} archived New archived value to assign
         */
        public setArchived(this: Loan, archived: boolean): void {
            this.archived = archived;
        }
        /** Update loan pay frequency, if given value is not valid throws an error.
         * @param {TPayFrequency} payFrequency New loan pay frequency value to assign
         * @throws BadRequestError If provided value is invalid
         */
        public setPayFrequency(this: Loan, payFrequency: TPayFrequency): void {
            if(!isValidPayFrequency(payFrequency)) {
                throw new BadRequestError(`Invalid pay frequency (${payFrequency}) for creating/updating a loan.`);
            }
            this.payFrequency = payFrequency;
        }
        /** Get issuer bank information.
         * @return {Bank} The desired loan issuer bank object
         */
        public getIssuer(this: Loan): Bank {
            return this.bank;
        }
    };
};
