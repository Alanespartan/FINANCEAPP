/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { CreateCardPayload, TCardTypes, ICard } from "@common/types/cards";
import { User, Bank } from "@entities";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import {
    setName, setCardNumber, setExpirationDate, setArchived,
    setType, doPayment, addBalance, getIssuer
} from "./methods/all";
import { setLimit, getLimit, getUsedCredit } from "./methods/credit";
import { setIsVoucher, getIsVoucher } from "./methods/voucher";

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
    @Column({ default: 0 })
    public limit!: number;
    @Column({ default: false })
    public isVoucher!: boolean;

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
    public constructor(options?: CreateCardPayload, userId?: number) {
        if(options) {
            // FROM PAYLOAD
            this.name       = options.name ?? `Tarjeta ${options.cardNumber}`;
            this.cardNumber = options.cardNumber;
            this.balance    = options.balance;
            this.type       = options.type;
            this.expires    = ConvertToUTCTimestamp(options.expires);

            // RELATIONSHIP ATTRIBUTES
            this.bankId = options.bankId;

            // DEFAULT ATTRIBUTES
            this.archived = false;
        }
        // we put this here so we can save cards adding these directly into user array
        // or by creating the object and setting the id manually.
        if(userId) {
            this.userId = userId;
        }
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

/* Attach methods from external files for modularity */
// GENERAL CARD METHODS
Card.prototype.setName = setName;
Card.prototype.setCardNumber = setCardNumber;
Card.prototype.setExpirationDate = setExpirationDate;
Card.prototype.setArchived = setArchived;
Card.prototype.setType = setType;
Card.prototype.doPayment = doPayment;
Card.prototype.addBalance = addBalance;
Card.prototype.getIssuer = getIssuer;
// CREDIT CARD METHODS
Card.prototype.setLimit = setLimit;
Card.prototype.getLimit = getLimit;
Card.prototype.getUsedCredit = getUsedCredit;
// VOUCHER CARD METHODS
Card.prototype.setIsVoucher = setIsVoucher;
Card.prototype.getIsVoucher = getIsVoucher;

// TypeScript doesn’t know about dynamically added methods (prototype), even though they exist at runtime.
// Declare additional methods to satisfy TypeScript's type system satefy check.
// When extending the class in a declare module, we only need to declare the method's normal parameters and return type
// TypeScript knows the method will be called in the context of a Card instance, so it infers that this refers to Card.
declare module "./Card" {
    interface Card {
        /** Update card custom name */
        setName(this: Card, name: string): void;
        /** Update card number */
        setCardNumber(this: Card, cardNumber: string): void;
        /** Update card expiration date using a timestamp date */
        setExpirationDate(this: Card, expires: number): void;
        /** Update archived card attribute */
        setArchived(this: Card, archived: boolean): void;
        /** Update card type */
        setType(this: Card, type: TCardTypes): void;
        /** Reduce balance from card if there is enough to do a payment, otherwise throws an error */
        doPayment(this: Card, amountToPay: number): void;
        /** Add money to card balance */
        addBalance(this: Card, amount: number): void;
        /** Get issuer bank information */
        getIssuer(this: Card): Bank;

        /** Update credit card limit value */
        setLimit(this: Card, limit: number): void;
        /** Get credit card limit value */
        getLimit(this: Card): number;
        /** Get used balance from credit card according to its given limit */
        getUsedCredit(this: Card): number;

        /** Update isVoucher card attribute */
        setIsVoucher(this: Card, isVoucher: boolean): void;
        /** Get isVoucher value if card id debit, otherwise throws an error */
        getIsVoucher(this: Card): boolean;
    }
}
