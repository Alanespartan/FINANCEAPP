import { UpdateCardPayload } from "../../../../../../common/types/cards";
import { ValidCreation_CreditCardSimple } from "../valid/create";

// GENERAL
export const InvalidUpdate_CardNumberIsIncorrect = "4815a6973b7892c1532d";
export const InvalidUpdate_CardDoesNotExist = "9815692153273789";
export const InvalidUpdate_DuplicatedCard = {
    cardNumber: ValidCreation_CreditCardSimple.cardNumber
} as UpdateCardPayload;
export const InvalidUpdate_NewCardIsIncorrect = {
    cardNumber: InvalidUpdate_CardNumberIsIncorrect
} as UpdateCardPayload;
export const InvalidUpdate_ExpirationDateIsIncorrect = {
    expires: new Date().getTime() - 100000000,
} as UpdateCardPayload;
export const InvalidUpdate_CardTypeIsIncorrect = {
    type: -1
};

// DEBIT
export const InvalidUpdate_DebitCardHasLimit = {
    limit: 10000
} as UpdateCardPayload;
export const InvalidUpdate_DebitIsNowCreditAndHasNoLimit = {
    type: 2
} as UpdateCardPayload;
export const InvalidUpdate_DebitIsNowCreditAndLimitIsIncorrect = {
    type: 2,
    limit: -1
} as UpdateCardPayload;
export const InvalidUpdate_DebitIsNowCreditAndIsVoucher = {
    type: 2,
    limit: 60000,
    isVoucher: true
} as UpdateCardPayload;

// CREDIT
export const InvalidUpdate_CreditCardLimitIsIncorrect = {
    limit: -1
} as UpdateCardPayload;
export const InvalidUpdate_CreditIsNowDebitAndHasLimit = {
    type: 1,
    limit: 10000
} as UpdateCardPayload;
export const InvalidUpdate_CreditCardIsVoucher = {
    isVoucher: true
} as UpdateCardPayload;
