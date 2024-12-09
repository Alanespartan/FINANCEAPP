import { CreateCardPayload } from "../../../../../../../common/types/cards";

// DEBIT
export const ValidCreation_DebitCardSimple = {
    cardNumber: "4815697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000,

    name:       "Debit Card Simple Test",
} as CreateCardPayload;
export const ValidCreation_DebitCardIsVoucher = {
    cardNumber: "4815697378921531",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    20000,

    name:       "Debit Card Voucher Test",
    isVoucher:  true
} as CreateCardPayload;
export const ValidCreation_DebitCardNoName = {
    cardNumber: "4815697378921532",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    30000
} as CreateCardPayload;

// CREDIT
export const ValidCreation_CreditCardSimple = {
    cardNumber: "5815697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,

    name:       "Credit Card Simple Test",
    limit:      20000
} as CreateCardPayload;
export const ValidCreation_CreditCardNoName = {
    cardNumber: "5815697378921531",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    30000,

    limit:      50000
} as CreateCardPayload;
