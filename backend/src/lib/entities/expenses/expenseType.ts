/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { IExpenseType, CreateExpenseTypePayload, TExpenseType } from "@common/types/expenses";
import { User } from "@entities";
import { AllExpenseTypesMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// @Index is used when querying by certain "field" is frequent, and adding database indexes improves performance
// onDelete: "CASCADE" - When parent entity is deleted, related objects will be deleted too

@Entity()
export class ExpenseType extends AllExpenseTypesMixin(class {}) implements IExpenseType {
    @PrimaryGeneratedColumn()
    public readonly id!: number;
    @Column()
    public name!: string;
    @Column()
    public archived!: boolean;

    @Column()
    public type!: TExpenseType;
    @Column({ nullable: true })
    public instrumentId?: number;

    // Many-to-One relationship: An expense category belongs to one user, but a user can have many categories
    @ManyToOne(() => User, (user) => user.expenseTypes, {
        nullable: false,
        onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" }) // Explicitly map the foreign key column
    @Index()
    public user!: User;
    @Column()
    public userId!: number; // Explicitly define the foreign key column

    // Index signature allows using a string key to access properties
    [key: string]: any;  // You can replace `any` with a more specific type if needed

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    public constructor(options?: CreateExpenseTypePayload, userId?: number) {
        super();
        if(options) {
            // FROM PAYLOAD
            this.name = options.name;
            this.type = options.type;

            // RELATIONSHIP ATTRIBUTES
            this.instrumentId = options.instrumentId;

            // DEFAULT ATTRIBUTES
            this.archived = false;
        }
        // we put this here so we can save expense types adding these directly into user array
        // or by creating the object and setting the id manually.
        if(userId) {
            this.userId = userId;
        }
    }

    public toInterfaceObject(): IExpenseType {
        return {
            id:       this.id,
            name:     this.name,
            type:     this.type,
            archived: this.archived,
            userId:   this.userId,
            instrumentId: this.instrumentId
        } as IExpenseType;
    }
}
