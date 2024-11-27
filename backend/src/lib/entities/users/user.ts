/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { Expense } from "@common/types/payments";
import { CreateLoanPayload } from "@common/types/loans";
import { Card, Loan, ExpenseType }   from "@entities";
import { IUser } from "@common/types/users";
import { TCardFilters, TCardTypes } from "@common/types/cards";
import { CreateExpenseTypePayload, ETypesOfExpense } from "@common/types/expenses";

/* TypeScript and TypeORM Custom Attributes Explanation */
// Assertion! added since TypeORM will generate the value hence TypeScript does eliminates compile-time null and undefined checks
// eager: true - When user is fetched, typeorm will automatically fetch all the attached objects

@Entity()
@Unique([ "email" ]) // This creates a unique constraint on the email column
export class User implements IUser {
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
        eager: true
    })
    public cards!: Card[];

    // One-to-Many relationship: A user can have many cards
    @OneToMany(() => Loan, (loan) => loan.user, {
        eager: true
    })
    public loans!: Loan[];

    // One-to-Many relationship: A user can have many expense categories
    @OneToMany(() => ExpenseType, (expenseType) => expenseType.user, {
        eager: true
    })
    public expenseTypes!: ExpenseType[];

    public expenses: Expense[] = [];
    public incomes: any[] = []; // todo create interface

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
                type: ETypesOfExpense.REALEXPENSE
            } as CreateExpenseTypePayload;
            this.addExpenseType(new ExpenseType(ExpenseTypeOptions, this.id));
        }
    }

    /*---------------- CASH ----------------*/
    /**
    * Increase amount of available cash a user has.
    * @param {number} amount Amount of cash to be added to user savings.
    */
    public addCash(amount: number)      { this.cash += amount; }
    /**
    * Reduce amount of available cash a user has.
    * @param {number} amount Amount of cash to be removed from user savings.
    */
    public decreaseCash(amount: number) { this.cash -= amount; }


    /*---------------- CARDS ---------------- */
    /**
    * Create a new card in user information.
    * @param {Card} newCard Contains information of new card.
    */
    public addCard(newCard: Card) {
        this.cards.push(newCard);
    }

    /**
    * Checks if a card already exists in user data.
    * @param {string} cardNumber Card number to search for.
    */
    public hasCard(cardNumber: string): boolean {
        return this.getCard(cardNumber) ? true : false;
    }

    /**
    * Get a specific stored user card using its card number id.
    * @param {string} cardNumber Card number to search for.
    */
    public getCard(cardNumber: string): Card | undefined {
        return this.cards.find((c) => c.getCardNumber() === cardNumber);
    }

    /**
    * Get all stored user cards.
    * @param {TCardFilters} type Used to filter user cards if a type was given in the request. Otherwise, it returns all cards the user has.
    */
    public getCards(type: TCardFilters): Card[] {
        if(type !== 0) {
            return this.cards.filter((c) => c.getCardType() === type);
        }
        return this.cards;
    }

    /**
    * Get the db id of a desired stored user card.
    *
    * Always use "hasCard()" method first so you validate the card exist in user data.
    * @param {string} cardNumber Card number to search for.
    */
    public getCardId(cardNumber: string): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.getCard(cardNumber)!.getId();
    }

    /**
    * Get the type of a desired stored user card.
    *
    * Always use "hasCard()" method first so you validate the card exist in user data.
    * @param {string} cardNumber Card number to search for.
    */
    public getCardType(cardNumber: string): TCardTypes {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.getCard(cardNumber)!.getCardType();
    }

    /**
    * Get a specific stored user card using its card alias. // TODO CARD make this get by field (options payload)
    * @param {string} cardAlias Card alias to search for.
    */
    public getCardByAlias(cardAlias: string): Card | undefined {
        return this.cards.find((c) => c.getName() === cardAlias);
    }

    /**
    * Delete card from user data.
    * @param {number} index Array index of the selected card.
    */
    public removeCard(index: number) {
        if(index < this.cards.length || index > this.cards.length) { throw new Error("Card index out of bounds."); }
        const deleted = this.cards.splice(index, 1);
        console.log("The following card was deleted correctly: " + deleted[0].getName());
    }

    /*---------------- LOANS ----------------*/
    /**
    * Save a new loan in user information.
    */
    public addLoan(options: CreateLoanPayload) {
        this.loans.push(new Loan(options, this.id));
    }
    /**
    * Get stored user loan.
    * @param {number} index Position of the loan in user array.
    */
    public getLoan(index: number) {
        return this.loans[index];
    }


    /*---------------- EXPENSE TYPES ----------------*/
    /**
    * Save a new expense category in user information.
    * @param {ExpenseType} newExpenseType Contains information of new expense category.
    */
    public addExpenseType(newExpenseType: ExpenseType) {
        this.expenseTypes.push(newExpenseType);
    }
    /**
    * Helper function that obtains the desired expense type.
    * @param {string} name Expense type name to search for.
    */
    public getExpenseType(name: string) {
        return this.expenseTypes.find((ec) => ec.name === name);
    }
    /**
    * Get all stored user expense types.
    */
    public getExpenseTypes() {
        return this.expenseTypes;
    }

    /*---------------- EXPENSES ----------------*/
    public addExpense(expense: Expense) {
        this.expenses.push(expense);
    }
    public removeExpense(index: number) {
        const deleted = this.expenses.splice(index, 1);
        console.log("The following expense was deleted correctly: " + deleted[0].id);
    }

    /*---------------- HELPER FUNCTIONS ----------------*/
    private user2Json() {
        const userObj = {
            userInfo: {
                id:        this.id,
                firstName: this.firstName,
                lastName:  this.lastName,
                email:     this.email
            }
        };
        return JSON.stringify(userObj);
    }
}
