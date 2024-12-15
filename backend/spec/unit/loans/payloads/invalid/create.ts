import { CreateLoanPayload } from "../../../../../../common/types/loans";

export const InvalidCreation_PayFrequencyIsIncorrect = {
    name: "PayFrequencyIsIncorrect",
    expires: 1832497156317,
    payFrequency: -1,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
};

export const InvalidCreation_BankDoesNotExist = {
    name: "BankDoesNotExist",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: -1
} as CreateLoanPayload;

export const InvalidCreation_DuplicatedLoan = {
    name: "Create Loan Simple Test",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_ExpirationDateIsIncorrect = {
    name: "ExpirationDateIsIncorrect",
    expires: new Date().getTime() - 10000,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_BorrowedIsIncorrect = {
    name: "BorrowedIsIncorrect",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: -100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_FixedPaymentAmountIsIncorrect = {
    name: "FixedPaymentAmountIsIncorrect",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: -5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_InterestsToPayIsIncorrect = {
    name: "InterestsToPayIsIncorrect",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: -12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_InterestsToPayIsGreaterThanBorrowedMoney = {
    name: "InterestsToPayIsGreaterThanBorrowedMoney",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 5000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
} as CreateLoanPayload;

export const InvalidCreation_AnnualInterestRateIsIncorrect = {
    name: "AnnualInterestRateIsIncorrect",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: -10,
    bankId: 1
} as CreateLoanPayload;
