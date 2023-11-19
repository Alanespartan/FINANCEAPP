import { Card } from "./Card";
import { CardOptions } from "@common/types/cards";

export class CreditCard extends Card {
    public readonly isCredit: boolean = true;
    private limit: number;
    constructor(options: CardOptions, limit: number) {
        super(options);
        this.limit = limit;
    }

    public getUsedBalance() {
        return this.limit - this.balance;
    }

    public increaseLimit(newLimit: number) {
        this.limit = newLimit;
    }
}