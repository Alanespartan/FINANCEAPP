import { Bank } from "@common/types/util";
import { CardOptions } from "@common/types/cards";

export class Card {
    protected cardNumber: string; // id
    protected alias: string;
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
        this.alias      = options.alias ?? `Tarjeta ${options.issuer.name} ${options.cardNumber}`;
    }

    public addBalance(amount: number) {
        this.balance += amount;
    }

    // decrease balance
    public pay(amount: number) {
        if(this.balance < amount) throw new Error(`Couldn't complete the transaction. Insufficient funds in ${this.alias}.`);
        this.balance -= amount;
    }

    public setAlias(alias: string) {
        this.alias = alias;
    }

    public getAlias() {
        return this.alias;
    }

    public setCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber;
    }

    public getCardNumber() {
        return this.cardNumber;
    }

    public setExpiryDate(expires: Date) {
        this.expires = expires;
    }

    public getIssuerName() {
        return this.issuer.name;
    }
}