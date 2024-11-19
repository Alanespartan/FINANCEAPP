import { Card } from "./Card";
import { CardOptions, CardTypes } from "@common/types/cards";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CardOptions, isVoucher: boolean) {
        super(options, CardTypes.DEBIT);
        this.isVoucher = isVoucher;
    }
}
