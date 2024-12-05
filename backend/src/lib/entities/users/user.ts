/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { Card, Loan, ExpenseType } from "@entities";
import { CreateExpenseTypePayload, OETypesOfExpense } from "@common/types/expenses";
import { IUser } from "@common/types/users";
import { Expense } from "@common/types/payments";
import { TCardFilters, UpdateCardPayload } from "@common/types/cards";
import {
    addCard, hasCard,
    getCard, getCards,
    setOptionsIntoCard
} from "./methods/cards";
import {
    addExpenseType, hasExpenseType,
    getExpenseType, getExpenseTypes
} from "./methods/expenseTypes";
import {
    addLoan,
    getLoans
} from "./methods/loans";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// eager: true - When user is fetched, typeorm will automatically fetch all the attached objects
// cascade: true - unless you specify the cascade option in the relationship decorator, TypeORM wont automatically save related entities when saving the parent user entity.

@Entity()
@Unique([ "email" ]) // This creates a unique constraint on the email column
export class User implements IUser {
    // #region Class Attributes
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
    @Column()
    public cash!: number;

    // One-to-Many relationship: A user can have many cards
    @OneToMany(() => Card, (card) => card.user, {
        eager: true,
        cascade: true
    })
    public cards!: Card[];

    // One-to-Many relationship: A user can have many cards
    @OneToMany(() => Loan, (loan) => loan.user, {
        eager: true
    })
    public loans!: Loan[];

    // One-to-Many relationship: A user can have many expense categories
    @OneToMany(() => ExpenseType, (expenseType) => expenseType.user, {
        eager: true,
        cascade: true
    })
    public expenseTypes!: ExpenseType[];

    public expenses: Expense[] = [];
    public incomes: any[] = []; // todo create interface
    // #endregion Class Attributes

    // #region Class Constructor
    // TypeORM requires that entities have parameterless constructors (or constructors that can handle being called with no arguments).
    constructor(email?: string, password?: string, firstName?: string, lastName?: string) {
        if(email && password && firstName && lastName) {
            // FROM PAYLOAD
            this.email     = email;
            this.password  = password;
            this.firstName = firstName;
            this.lastName  = lastName;

            // DEFAULT ATTRIBUTES
            this.cash     = 0;
            this.cards    = [];
            this.expenses = [];
            this.loans    = [];
            this.incomes  = [];
            this.expenseTypes = [];

            // create "Other" expense category
            // so we can register when motive of payment is "Other" or "Unknown"
            const ExpenseTypeOptions = {
                name: "Other",
                type: OETypesOfExpense.REALEXPENSE
            } as CreateExpenseTypePayload;
            this.addExpenseType(new ExpenseType(ExpenseTypeOptions));
        }
    }
    // #endregion Class Constructor

    private toInterfaceObject() {
        return {
            id:           this.id,
            email:        this.email,
            firstName:    this.firstName,
            lastName:     this.lastName ,
            cash:         this.cash ,
            cards:        this.cards ,
            loans:        this.loans ,
            expenseTypes: this.expenseTypes
        } as IUser;
    }
}

// #region Prototype Attachment
/* Attach methods from external files for modularity */
// CARDS METHODS
User.prototype.addCard = addCard;
User.prototype.hasCard = hasCard;
User.prototype.getCard = getCard;
User.prototype.getCards = getCards;
User.prototype.setOptionsIntoCard = setOptionsIntoCard;
// EXPENSE TYPES METHODS
User.prototype.addExpenseType = addExpenseType;
User.prototype.hasExpenseType = hasExpenseType;
User.prototype.getExpenseType = getExpenseType;
User.prototype.getExpenseTypes = getExpenseTypes;
// LOANS METHODS
User.prototype.addLoan = addLoan;
User.prototype.getLoans = getLoans;

// TypeScript doesn’t know about dynamically added methods (prototype), even though they exist at runtime.
// Declare additional methods to satisfy TypeScript's type system satefy check.
// When extending the class in a declare module, we only need to declare the method's normal parameters and return type
// TypeScript knows the method will be called in the context of a User instance, so it infers that this refers to User.
declare module "./User" {
    interface User {
        addCard(toAdd: Card): void;
        hasCard(cardNumber: string): boolean;
        getCard(cardNumber: string): Card;
        getCards(type: TCardFilters): Card[];
        setOptionsIntoCard(cardNumber: string, options: UpdateCardPayload): Card;


        /**
        * Save a new expense type category in user array.
        * @param toAdd New Expense Type Object to save in user array
        */
        addExpenseType(toAdd: ExpenseType): void;
        /**
        * Checks if a expense type already exists in user data.
        * @param toSearch Expense type name to search for.
        */
        hasExpenseType(toSearch: string): boolean;
        /**
        * Helper function that obtains the desired expense type.
        * @param name Expense type name to search for.
        */
        getExpenseType(name: string): ExpenseType | undefined;
        /**
        * Get all stored user expense types.
        */
        getExpenseTypes(): ExpenseType[];

        addLoan(toAdd: Loan): void;
        getLoans(): Loan[];
    }
}
// #endregion Prototype Attachment
