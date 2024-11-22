import { IBank } from "@common/types/util";
import { CreateCardPayload, ECardTypes } from "@common/types/cards";
//import { Card } from "@common/types/cards";

//export class lCard implements Card {
export class Card {
    protected cardNumber: string; // id
    protected alias: string;
    protected holderName: string;
    protected expires: Date;
    protected issuer: IBank;
    protected balance: number;
    protected type: ECardTypes;
    protected archived: boolean;

    public constructor(options: CreateCardPayload, type: ECardTypes) {
        this.cardNumber = options.cardNumber;
        this.holderName = options.holderName;
        this.issuer     = options.issuer;
        this.expires    = options.expires;
        this.balance    = options.balance;
        this.alias      = options.alias ?? `Tarjeta ${options.issuer.name} ${options.cardNumber}`;
        this.type       = type;
        this.archived   = false;
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

    public setExpirationDate(expires: Date) {
        this.expires = expires;
    }

    public getIssuerName() {
        return this.issuer.name;
    }

    public setCardType(type: ECardTypes) {
        this.type = type;
    }

    public getCardType() {
        return this.type;
    }

    public setArchived(archived: boolean) {
        this.archived = archived;
    }

    public getArchived() {
        return this.archived;
    }
}
