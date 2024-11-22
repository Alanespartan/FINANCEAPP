import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { CreateCardPayload, ECardTypes } from "@common/types/cards";
import { IBank } from "@common/types/util";
import { ICard } from "@common/types/cards";
import { User }  from "../users/user";
import { BadRequestError } from "../../errors";

@Entity()
export class Card implements ICard {
    @ManyToOne(() => User, (user) => user.cards)
    public owner!: User;
    @PrimaryColumn()
    public cardNumber: string; // id
    @Column()
    public alias: string;
    @Column()
    public holderName: string;
    @Column()
    public expires: Date;
    @Column()
    public issuer: IBank;
    @Column()
    public balance: number;
    @Column()
    public type: ECardTypes;
    @Column()
    public archived: boolean;
    @Column()
    public limit?: number;
    @Column()
    public isVoucher?: boolean;

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

    /* CREDIT CARD METHODS */
    public getUsedBalance() {
        // type guard safety check to avoid thrown errors during runtime
        if(this.type === ECardTypes.CREDIT && this.limit !== undefined) {
            return this.limit - this.balance;
        }
        throw new BadRequestError("Can't get used balance since the credit is a non credit card.");
    }
    public setLimit(limit: number) {
        this.limit = limit;
    }
    public getLimit() {
        // type guard safety check to avoid thrown errors during runtime
        if(this.type === ECardTypes.CREDIT && this.limit !== undefined) {
            return this.limit;
        }
        throw new BadRequestError("Can't get limit since the credit is a non credit card.");
    }

    /* VOUCHER CARD METHODS */
    public setIsVoucher(isVoucher: boolean) {
        this.isVoucher = isVoucher;
    }
}
