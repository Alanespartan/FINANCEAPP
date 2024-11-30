import { Loan, User } from "@entities";

export function addLoan(this: User, toAdd: Loan) {
    this.loans.push(toAdd);
}

export function getLoans(this: User) {
    return this.loans;
}
