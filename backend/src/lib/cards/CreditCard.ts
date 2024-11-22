import { Card } from "./Card";
import { CreateCardPayload, ECardTypes } from "@common/types/cards";

export class CreditCard extends Card {
    public readonly isCredit: boolean = true;
    private limit: number;
    constructor(options: CreateCardPayload, limit: number) {
        super(options, ECardTypes.CREDIT);
        this.limit = limit;
    }

    public getUsedBalance() {
        return this.limit - this.balance;
    }

    public setLimit(limit: number) {
        this.limit = limit;
    }
}
