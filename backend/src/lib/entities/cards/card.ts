/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { CreateCardPayload, TCardTypes, OECardTypesFilters, ICard } from "@common/types/cards";
import { User, Bank } from "@entities";
import { BadRequestError } from "@errors";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance
// onDelete: "CASCADE" - When parent entity is deleted, related objects will be deleted too

@Entity()
@Unique([ "cardNumber" ]) // This creates a unique constraint on the cardNumber column
export class Card implements ICard {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public cardNumber!: string;
    @Column()
    public name!: string;
    @Column({ type: "bigint" })
    public expires!: number;
    @Column({ type: "real" }) // 6 decimal digits precision
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
    @ManyToOne(() => User, (user) => user.cards, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // Many-to-One relationship: A card is issued by one bank, but a bank can have many issued cards
    @ManyToOne(() => Bank, (bank) => bank.cards, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "bankId" }) // Explicitly map the foreign key column
    public bank!: Bank;
    @Column()
    public bankId!: number; // Explicitly define the foreign key column

    // Index signature allows using a string key to access properties
    [key: string]: any;  // You can replace `any` with a more specific type if needed

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateCardPayload, type?: TCardTypes, userId?: number) {
        if(options && type && userId) {
            // FROM PAYLOAD
            this.name       = options.name ?? `Tarjeta ${options.cardNumber}`;
            this.cardNumber = options.cardNumber;
            this.balance    = options.balance;
            this.expires    = ConvertToUTCTimestamp(options.expires);
            this.type       = type;

            // RELATIONSHIP ATTRIBUTES
            this.userId = userId;
            this.bankId = options.bankId;

            // DEFAULT ATTRIBUTES
            this.archived = false;
        }
    }

    public getId() {
        return this.id;
    }

    public addBalance(amount: number) {
        this.balance += amount;
    }

    public getBalance() {
        return this.balance;
    }

    // decrease balance
    public pay(amount: number) {
        if(this.balance < amount) throw new Error(`Couldn't complete the transaction. Insufficient funds in ${this.name}.`);
        this.balance -= amount;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public setCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber;
    }

    public getCardNumber() {
        return this.cardNumber;
    }

    public setExpirationDate(expires: number) {
        this.expires = expires;
    }

    public getExpirationDate() {
        return this.expires;
    }

    public getIssuerName() {
        return this.bank.name;
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

    public getIsVoucher() {
        return this.isVoucher;
    }

    public toInterfaceObject() {
        return {
            id:         this.id,
            cardNumber: this.cardNumber,
            name:       this.name,
            expires:    this.expires,
            balance:    this.balance,
            type:       this.type,
            archived:   this.archived,
            userId:     this.userId,
            bankId:     this.bankId,
            limit:      this.limit,
            isVoucher:  this.isVoucher,
        } as ICard;
    }
}
