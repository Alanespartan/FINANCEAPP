import { Card } from "./Card";
import { CardOptions, CardTypes } from "@common/types/cards";

export class CreditCard extends Card {
    public readonly isCredit: boolean = true;
    private limit: number;
    constructor(options: CardOptions, limit: number) {
        super(options, CardTypes.CREDIT);
        this.limit = limit;
    }

    public getUsedBalance() {
        return this.limit - this.balance;
    }

    public setLimit(limit: number) {
        this.limit = limit;
    }
}
