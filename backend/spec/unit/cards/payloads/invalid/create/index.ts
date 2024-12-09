import { CreateCardPayload } from "../../../../../../../common/types/cards";

// GENERAL
export const InvalidCreation_CardTypeIsIncorrect = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       -1,
    bankId:     1,
    balance:    10000
};
export const InvalidCreation_CardNumberIsIncorrect = {
    cardNumber: "4915a6973b7892c1530d",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000
} as CreateCardPayload;
export const InvalidCreation_DuplicatedCard = {
    cardNumber: "4815697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000
} as CreateCardPayload;
export const InvalidCreation_BankDoesNotExist = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     -1,
    balance:    10000
} as CreateCardPayload;

// DEBIT
export const InvalidCreation_DebitCardHasLimit = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000,

    limit:      20000
} as CreateCardPayload;

// CREDIT
export const InvalidCreation_CreditCardNoLimit = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,
} as CreateCardPayload;
export const InvalidCreation_CreditCardLimitIsIncorrect = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,

    limit:      -1
} as CreateCardPayload;
export const InvalidCreation_CreditCardIsVoucher = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    30000,

    limit:      50000,
    isVoucher:  true
} as CreateCardPayload;
