import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { CreateCardPayload, TCardTypes, OECardTypesFilters } from "@common/types/cards";
import { ICard } from "@common/types/cards";
import { User }  from "../users/user";
import { Bank }  from "../banks/bank";
import { BadRequestError } from "../../errors";

@Entity()
export class Card implements ICard {
    // Many-to-One relationship: A card belongs to one user
    @ManyToOne(() => User, (user) => user.cards)
    public owner!: User; // Assertion added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
    @PrimaryColumn()
    public cardNumber!: string; // id
    @Column()
    public alias!: string;
    @Column()
    public expires!: Date;
    // Many-to-One relationship: A card is issued by one bank
    // There is only nagivation from card to bank, bank class does not know the relationship with card (missing One-to-Many relationship)
    @ManyToOne(() => Bank, (bank) => bank.id)
    public issuer!: Bank;
    @Column()
    public balance!: number;
    @Column()
    public type!: TCardTypes;
    @Column()
    public archived!: boolean;
    @Column()
    public limit?: number;
    @Column()
    public isVoucher?: boolean;

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateCardPayload, type?: TCardTypes) {
        if(options && type) {
            this.cardNumber = options.cardNumber;
            this.issuer     = options.issuer;
            this.expires    = options.expires;
            this.balance    = options.balance;
            this.alias      = options.alias ?? `Tarjeta ${options.issuer.name} ${options.cardNumber}`;
            this.type       = type;
            this.archived   = false;
        }
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

    public setCardType(type: TCardTypes) {
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
        if(this.type === OECardTypesFilters.CREDIT && this.limit !== undefined) {
            return this.limit - this.balance;
        }
        throw new BadRequestError("Can't get used balance since the credit is a non credit card.");
    }
    public setLimit(limit: number) {
        if(this.type === OECardTypesFilters.CREDIT) {
            this.limit = limit;
        }
        throw new BadRequestError("Can't set limit since the card is a non credit card.");
    }
    public getLimit() {
        if(this.type === OECardTypesFilters.CREDIT && this.limit !== undefined) {
            return this.limit;
        }
        throw new BadRequestError("Can't get limit since the card is a non credit card.");
    }

    /* VOUCHER CARD METHODS */
    public setIsVoucher(isVoucher: boolean) {
        this.isVoucher = isVoucher;
    }
}
