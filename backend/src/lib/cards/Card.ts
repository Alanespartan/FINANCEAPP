import { Bank } from "@common/types/util";
import { CardOptions } from "@common/types/cards";

export class Card {
    public cardNumber: string; // id
    public alias?: string;
    protected holderName: string;
    protected expires: Date;
    protected issuer: Bank;
    protected balance: number;

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