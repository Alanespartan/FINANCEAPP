import { CreateLoanPayload } from "../../../../../../common/types/loans";

export const ValidCreation_LoanSimple = {
    name: "Create Loan Simple Test",
    expires: 1832497156317,
    payFrequency: 3,
    borrowed: 100000,
    fixedPaymentAmount: 5500,
    interestsToPay: 12000,
    annualInterestRate: 10,
    bankId: 1
}  as CreateLoanPayload;

export const ValidCreation_MultipleDummyLoans: CreateLoanPayload[] = [
    {
        name: "Dummy Loan 1",
        expires: 1832497156317,
        payFrequency: 3,
        borrowed: 40500.75,
        fixedPaymentAmount: 2570.50,
        interestsToPay: 5000,
        annualInterestRate: 13.5,
        bankId: 1
    },
    {
        name: "Dummy Loan 2",
        expires: 1932497156317,
        payFrequency: 2,
        borrowed: 80500.75,
        fixedPaymentAmount: 4200,
        interestsToPay: 11700.95,
        annualInterestRate: 16,
        bankId: 1
    },
    {
        name: "Dummy Loan 3",
        expires: 1967897156317,
        payFrequency: 1,
        borrowed: 950000,
        fixedPaymentAmount: 7900,
        interestsToPay: 123000,
        annualInterestRate: 8,
        bankId: 1
    },
    {
        name: "Dummy Loan 4",
        expires: 1756497156317,
        payFrequency: 0,
        borrowed: 8500,
        fixedPaymentAmount: 4300,
        interestsToPay: 670.33,
        annualInterestRate: 9.32,
        bankId: 1
    }
];
