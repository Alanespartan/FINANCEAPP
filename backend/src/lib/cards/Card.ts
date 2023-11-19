import { Bank } from "@common/types/cards";
import { CardOptions } from "@common/types/cards";

export class Card {
    public cardNumber: string; // id
    protected holderName: string;
    protected expires: Date;
    protected issuer: Bank;
    protected balance: number;
    public alias: string; // default is number but can be updated by set by user

    public constructor(options: CardOptions) {
        this.cardNumber = options.cardNumber;
        this.holderName = options.holderName;
        this.issuer     = options.issuer;
        this.expires    = options.expires;
        this.balance    = options.balance;
        this.alias      = options.alias;
    }

    public addBalance(amount: number) {
        this.balance += amount;
    }

    public setAlias(alias: string) {
        this.alias = alias;
    }

    // decrease balance
    public pay(amount: number) {
        if(this.balance < amount) throw new Error(`Couldn't complete the transaction. Insufficient funds in ${this.alias}.`);
        this.balance -= amount;
    }
}