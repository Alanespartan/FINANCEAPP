import { Card } from "./Card";
import { CardOptions, MSIOptions } from "@common/types/cards";

export class CreditCard extends Card {
    public readonly isCredit: boolean = true;
    private limit: number;
    constructor(options: CardOptions, limit: number) {
        super(options);
        this.limit = limit;
        this.alias = `Tarjeta de Crédito ${this.issuer.name} ${this.cardNumber}`
    }

    public pay(amount: number, options: MSIOptions){
        if(this.balance > amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    public getUsedBalance() {
        return this.limit - this.balance;
    }

    public increaseLimit(newLimit: number) {
        this.limit = newLimit;
    }
}