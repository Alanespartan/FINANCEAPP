import { UpdateLoanPayload } from "../../../../../../common/types/loans";

export const ValidUpdate_LoanSimple = {
    name:       "Loan Simple Update Test",
    archived:   true,
    isFinished: true,
    expires:    new Date().getTime() + 100000000,
    borrowed:   150000,
    fixedPaymentAmount: 1000,
    interestsToPay: 25000,
    annualInterestRate: 8,
    payFrequency: 1
} as UpdateLoanPayload;

export const ValidUpdate_LoanIsFinished = {
    isFinished: true,
    name:       "Loan Update Is Finished Test"
} as UpdateLoanPayload;

export const ValidUpdate_LoanArchived = {
    archived: true,
    name:     "Loan Update Archived Test"
} as UpdateLoanPayload;

export const ValidUpdate_LoanIsFinishedAndArchived = {
    isFinished: true,
    archived: true,
    name:       "Loan Update Is Finished and Archived Test"
} as UpdateLoanPayload;
