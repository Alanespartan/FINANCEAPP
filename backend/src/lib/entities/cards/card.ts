import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { CreateCardPayload, TCardTypes, OECardTypesFilters, ICard } from "@common/types/cards";
import { User, Bank } from "@entities";
import { BadRequestError } from "@errors";

@Entity()
export class Card implements ICard {
    // Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
    @PrimaryColumn()
    public cardNumber!: string; // id
    @Column()
    public alias!: string;
    @Column()
    public expires!: Date;
    @Column()
    public balance!: number;
    @Column()
    public type!: TCardTypes;
    @Column()
    public archived!: boolean;
    @Column({ nullable: true })
    public limit?: number;
    @Column({ nullable: true })
    public isVoucher?: boolean;

    // Many-to-One relationship: A card belongs to one user, but a user can have many cards
    // Since querying by owner is frequent, adding database indexes to improve performance
    @ManyToOne(() => User, (user) => user.cards, { nullable: false })
    @JoinColumn({ name: "ownerId" }) // Explicitly map the foreign key column
    @Index()
    public owner!: User;
    @Column()
    public ownerId!: number; // Explicitly define the foreign key column

    // Many-to-One relationship: A card is issued by one bank
    // There is only nagivation from card to bank, bank class does not know the relationship with card (missing One-to-Many relationship)
    @ManyToOne(() => Bank, (bank) => bank.id, { nullable: false })
    @JoinColumn({ name: "issuerId" }) // Explicitly map the foreign key column
    public issuer!: Bank;
    @Column()
    public issuerId!: number; // Explicitly define the foreign key column

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateCardPayload, type?: TCardTypes, owner?: User) {
        if(options && type && owner) {
            this.owner      = owner;
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
        } else {
            throw new BadRequestError("Can't get used balance since the credit is a non credit card.");
        }
    }
    public setLimit(limit: number) {
        if(this.type !== OECardTypesFilters.CREDIT) {
            throw new BadRequestError("Can't set limit since the card is a non credit card.");
        }
        this.limit = limit;
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
