import { Card } from "./Card";
import { CardOptions, CardTypes } from "@common/types/cards";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CardOptions, isVoucher: boolean) {
        const type = isVoucher ? CardTypes.VOUCHER : CardTypes.DEBIT;
        super(options, type);
        this.isVoucher = isVoucher;
    }
}
