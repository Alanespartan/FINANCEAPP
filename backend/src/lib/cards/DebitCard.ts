import { Card } from "./Card";
import { CreateCardPayload, ECardTypes } from "@common/types/cards";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CreateCardPayload, isVoucher: boolean) {
        super(options, ECardTypes.DEBIT);
        this.isVoucher = isVoucher;
    }
}
