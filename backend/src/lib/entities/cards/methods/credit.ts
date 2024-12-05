import { BadRequestError } from "@backend/lib/errors";
import { OECardTypesFilters } from "@common/types/cards";
import { Card } from "@entities";

export function setLimit(this: Card, limit: number): void {
    if(this.type !== OECardTypesFilters.CREDIT) {
        throw new BadRequestError("Can't set limit since the card is a non credit card.");
    }
    this.limit = limit;
}

export function getLimit(this: Card): number {
    if(this.type !== OECardTypesFilters.CREDIT) {
        throw new BadRequestError("Can't get limit since the card is a non credit card.");
    }
    return this.limit;
}

export function getUsedCredit(this: Card): number {
    if(this.type !== OECardTypesFilters.CREDIT) {
        throw new BadRequestError("Can't get used balance since the card is a non credit card.");
    }
    return this.limit - this.balance;
}
