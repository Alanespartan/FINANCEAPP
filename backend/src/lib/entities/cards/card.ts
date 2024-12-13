/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { CreateCardPayload, TCardTypes, ICard } from "@common/types/cards";
import { User, Bank } from "@entities";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { AllCardsMixin, CreditCardMixin, VoucherCardMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance
// onDelete: "CASCADE" - When parent entity is deleted, related objects will be deleted too

@Entity()
@Unique([ "cardNumber" ]) // This creates a unique constraint on the cardNumber column
export class Card extends AllCardsMixin(CreditCardMixin(VoucherCardMixin(class {}))) implements ICard {
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
    // Note: This might cause erros with prototype if not handled correctly!!
    [key: string]: any;  // You can replace `any` with a more specific type if needed

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateCardPayload, userId?: number) {
        super();
        if(options) {
            // FROM PAYLOAD
            this.name       = options.name ?? `Tarjeta ${options.cardNumber}`;
            this.cardNumber = options.cardNumber;
            this.balance    = options.balance;
            this.type       = options.type;
            this.expires    = ConvertToUTCTimestamp(options.expires);
            this.isVoucher  = options.isVoucher ?? false;
            this.limit      = options.limit ?? 0;

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

    public toInterfaceObject(): ICard {
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
        };
    }
}
