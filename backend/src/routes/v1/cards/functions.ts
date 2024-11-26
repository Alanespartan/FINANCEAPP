import { TCardFilters, TCardTypes, OECardTypesFilters }   from "@common/types/cards";
import { Card } from "@entities";

export const isValidCardFilter = (value: number): value is TCardFilters => {
    return value === OECardTypesFilters.ALL
        || value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

export const isValidCardType = (value: number): value is TCardTypes => {
    return value === OECardTypesFilters.DEBIT
        || value === OECardTypesFilters.CREDIT
        || value === OECardTypesFilters.SERVICES;
};

export function MapNewToExistingArray(newCard: Card) {
    return {
        cardNumber: newCard.getCardNumber(),
        name:       newCard.getName(),
        expires:    newCard.getExpirationDate(),
        balance:    newCard.getBalance(),
        type:       newCard.getCardType(),
        archived:   newCard.getArchived(),
        limit:      newCard.getCardType() === OECardTypesFilters.CREDIT ? newCard.getLimit() : null,
        isVoucher:  newCard.getIsVoucher(),
        ownerId:    newCard.ownerId,
        issuerId:   newCard.issuerId,
    } as Card;
}
