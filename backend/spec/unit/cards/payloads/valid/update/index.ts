import { UpdateCardPayload } from "../../../../../../../common/types/cards";

// DEBIT
export const ValidUpdate_DebitCardSimple = {
    cardNumber: "4815923786975123",
    archived:   true,
    expires:    new Date().getTime() + 100000000,
    name:       "Debit Card Simple Update Test"
} as UpdateCardPayload;
export const ValidUpdate_DebitCardIsNowCredit = {
    type:  2,
    limit: 40000,
    name:  "Debit Card Is Now Credit Card Test"
} as UpdateCardPayload;
export const ValidUpdate_VoucherCardIsNowCredit = {
    type:  2,
    limit: 35000,
    name:  "Voucher Card Is Now Credit Card Test"
} as UpdateCardPayload;

// CREDIT
export const ValidUpdate_CreditCardIsNowDebit = {
    type:     1,
    archived: true,
    name:     "Credit Card Is Now Debit Card Test",
    expires:  new Date().getTime() + 150000000,
} as UpdateCardPayload;
