import { Card } from "./Card";
import { CardOptions } from "@common/types/cards";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CardOptions, isVoucher: boolean) {
        super(options);
        this.isVoucher = isVoucher;
    }
}