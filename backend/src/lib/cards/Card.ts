import { Bank } from "@common/types/cards";
import { CardOptions } from "@common/types/cards";
import { User } from "@src/session/user";

export class Card {
    protected cardNumber: string; // id
    protected holderName: string;
    protected expires: Date;
    protected issuer: Bank;
    protected balance: number;
    public alias?: string; // set by user
    protected user: User;

    public constructor(options: CardOptions, user: User) {
        this.cardNumber = options.cardNumber;
        this.holderName = options.holderName;
        this.issuer     = options.issuer;
        this.expires    = options.expires;
        this.balance    = options.balance;
        this.user       = user;
    }

    public addBalance(amount: number) {
        this.balance += amount;
    }

    public setAlias(alias: string) {
        this.alias = alias;
    }
}