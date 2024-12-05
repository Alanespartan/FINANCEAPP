import { BadRequestError } from "@backend/lib/errors";
import { OECardTypesFilters } from "@common/types/cards";
import { Card } from "@entities";

export function setIsVoucher(this: Card, isVoucher: boolean): void {
    if(this.type !== OECardTypesFilters.DEBIT) {
        throw new BadRequestError("Can't set voucher state since the card is a non debit card.");
    }
    this.isVoucher = isVoucher;
}

export function getIsVoucher(this: Card): boolean {
    if(this.type !== OECardTypesFilters.DEBIT) {
        throw new BadRequestError("Can't get voucher state since the card is a non debit card.");
    }
    return this.isVoucher;
}
