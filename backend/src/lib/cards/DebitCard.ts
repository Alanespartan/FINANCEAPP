import { Card } from "./Card";
import { CardOptions } from "@common/types/cards";
import { User } from "@src/session/user";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CardOptions, isVoucher: boolean, user: User) {
        super(options, user);
        this.isVoucher = isVoucher;
        this.alias = `Tarjeta de Débito ${this.issuer.name} ${this.cardNumber}`;
    }

    public pay(amount: number) {
        if(this.balance > amount) {
            this.balance -= amount;
        }
        throw new Error(`Couldn't complete the transaction. Insufficient funds in ${this.alias}.`);
    }
}