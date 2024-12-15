import { UpdateLoanPayload } from "../../../../../../common/types/loans";

export const InvalidUpdate_PayFrequencyIsIncorrect = {
    name: "PayFrequencyIsIncorrect",
    payFrequency: -1
};

export const InvalidUpdate_DuplicatedLoan = {
    name: "Dummy Loan 1"
} as UpdateLoanPayload;

export const InvalidUpdate_ExpirationDateIsIncorrect = {
    name: "ExpirationDateIsIncorrect",
    expires: new Date().getTime() - 10000000
} as UpdateLoanPayload;

export const InvalidUpdate_BorrowedIsIncorrect = {
    name: "BorrowedIsIncorrect",
    borrowed: -100000
} as UpdateLoanPayload;

export const InvalidUpdate_FixedPaymentAmountIsIncorrect = {
    name: "FixedPaymentAmountIsIncorrect",
    fixedPaymentAmount: -5500
} as UpdateLoanPayload;

export const InvalidUpdate_InterestsToPayIsIncorrect = {
    name: "InterestsToPayIsIncorrect",
    interestsToPay: -12000
} as UpdateLoanPayload;

export const InvalidUpdate_InterestsToPayIsGreaterThanBorrowedMoney = {
    name: "InterestsToPayIsGreaterThanBorrowedMoney",
    borrowed: 5000,
    interestsToPay: 12000
} as UpdateLoanPayload;

export const InvalidUpdate_AnnualInterestRateIsIncorrect = {
    name: "AnnualInterestRateIsIncorrect",
    annualInterestRate: -10
} as UpdateLoanPayload;
