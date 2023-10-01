import { Card } from "./Card";
import { CardOptions, MSIOptions } from "@common/types/cards";
import { User } from "@src/session/user";

export class CreditCard extends Card {
    public readonly isCredit: boolean = true;
    private limit: number;
    constructor(options: CardOptions, limit: number, user: User) {
        super(options, user);
        this.limit = limit;
        this.alias = `Tarjeta de Crédito ${this.issuer.name} ${this.cardNumber}`;
    }

    public pay(amount: number, options?: MSIOptions){
        if(this.balance > amount) {
            this.balance -= amount;
        }
        throw new Error(`Couldn't complete the transaction. Insufficient funds in ${this.alias}.`);
    }

    public getUsedBalance() {
        return this.limit - this.balance;
    }

    public increaseLimit(newLimit: number) {
        this.limit = newLimit;
    }
}