import { Card } from "./Card";
import { CardOptions } from "@common/types/cards";

export class DebitCard extends Card {
    protected isVoucher: boolean;
    constructor(options: CardOptions, isVoucher: boolean) {
        super(options);
        this.isVoucher = isVoucher;
        this.alias = `Tarjeta de Débito ${this.issuer.name} ${this.cardNumber}`
    }

    public pay(amount: number) {
        if(this.balance > amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}