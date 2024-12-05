import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { Card, ExpenseType, Loan } from "@entities";
import { IUser } from "@common/types/users";
import { CreateExpenseTypePayload, OETypesOfExpense } from "@common/types/expenses";
import {CardsMixin, LoansMixin, ExpenseTypesMixin } from "./mixins";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Use TypeORM decorators directly in the final class instead of mixins
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// eager: true - When user is fetched, typeorm will automatically fetch all the attached objects
// cascade: true - unless you specify the cascade option in the relationship decorator, TypeORM wont automatically save related entities when saving the parent user entity.

@Entity()
@Unique([ "email" ]) // This creates a unique constraint on the email column
export class User extends ExpenseTypesMixin(CardsMixin(LoansMixin(class {}))) implements IUser {
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    @Column({ default: 0 })
    public cash!: number;

    // One-to-Many relationship: A user can have many cards
    @OneToMany(() => Card, (card) => card.user, { eager: true, cascade: true })
    public cards!: Card[];

    // One-to-Many relationship: A user can have many loans
    @OneToMany(() => Loan, (loan) => loan.user, { eager: true })
    public loans!: Loan[];

    // One-to-Many relationship: A user can have many expense categories
    @OneToMany(() => ExpenseType, (expenseType) => expenseType.user, {
        eager: true,
        cascade: true,
    })
    public expenseTypes!: ExpenseType[];

    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    constructor(email?: string, password?: string, firstName?: string, lastName?: string) {
        super();
        if(email && password && firstName && lastName) {
            // FROM PAYLOAD
            this.email     = email;
            this.password  = password;
            this.firstName = firstName;
            this.lastName  = lastName;

            // DEFAULT ATTRIBUTES
            this.cash         = 0;
            this.cards        = [];
            this.loans        = [];
            this.expenseTypes = [];

            // create default expense categories e.g. "Other", "Unknown", "Groseries"
            this.addExpenseType(new ExpenseType({ name: "Other", type: OETypesOfExpense.REALEXPENSE } as CreateExpenseTypePayload));
        }
    }

    public toInterfaceObject(): IUser {
        return {
            id:           this.id,
            email:        this.email,
            firstName:    this.firstName,
            lastName:     this.lastName,
            cash:         this.cash,
            cards:        this.cards,
            loans:        this.loans,
            expenseTypes: this.expenseTypes
        };
    }
}
