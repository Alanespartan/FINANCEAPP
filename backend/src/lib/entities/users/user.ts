/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Logger } from "@common/types/logger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Expense, ExpenseCategory } from "@common/types/payments";
import { randomUUID }  from "crypto";
import { Card }        from "@backend/lib/entities/cards";
import { Loan }        from "@backend/lib/entities/loans";
import { IUser }       from "@common/types/users";
import { LoanOptions } from "@common/types/loans";
import { ECardTypes }  from "@common/types/cards";

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn()
    public readonly id!: number; // Assertion added since TypeORM will generate the value
    @Column()
    public readonly email: string;
    @Column()
    public readonly password: string;
    @Column()
    public readonly firstName: string;
    @Column()
    public readonly lastName: string;
    @Column()
    public cash: number;
    @OneToMany(() => Card, (card) => card.owner)
    public cards: Card[];
    public loans: Loan[];
    public expenses: Expense[];
    public expenseCategories: ExpenseCategory[];
    public incomes: any[]; // todo create interface

    constructor(email: string, password: string, firstName: string, lastName: string) {
        this.email     = email;
        this.password  = password;
        this.firstName = firstName;
        this.lastName  = lastName;
        // USER FINANCE STUFF
        this.cash     = 0;
        this.cards    = [];
        this.expenses = [];
        this.loans    = [];
        this.incomes  = [];
        // CUSTOM USER EXPERIENCE
        this.expenseCategories = [
            {
                id:        randomUUID(),
                alias:     "Other",
                isDefault: true
            } as ExpenseCategory
        ];
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
    * Save a new card in user information.
    * @param {AvailableCards} newCard Contains information of new card.
    */
    public addCard(newCard: Card) {
        this.cards.push(newCard);
    }
    /**
    * Get a specific stored user card using its card number id.
    * @param {string} cardNumber Card number to search for.
    */
    public getCard(cardNumber: string): Card | undefined {
        // do comparision removing whitespaces for safety and to avoid user errors
        return this.cards.find((c) => c.getCardNumber().replace(/\s+/g, "") === cardNumber.replace(/\s+/g, ""));
    }
    /**
    * Get all stored user cards.
    * @param {number} type Used to filter user cards if a type was given in the request.
    */
    public getCards(type: ECardTypes) {
        if(type !== 0) {
            return this.cards.filter((c) => c.getCardType() === type);
        }
        return this.cards;
    }
    /**
    * Get a specific stored user card using its card alias.
    * @param {string} cardAlias Card alias to search for.
    */
    public getCardByAlias(cardAlias: string): Card | undefined {
        return this.cards.find((c) => c.getAlias() === cardAlias);
    }
    /**
    * Delete card from user data.
    * @param {number} index Array index of the selected card.
    */
    public removeCard(index: number) {
        if(index < this.cards.length || index > this.cards.length) { throw new Error("Card index out of bounds."); }
        const deleted = this.cards.splice(index, 1);
        console.log("The following card was deleted correctly: " + deleted[0].getAlias());
    }


    /*---------------- LOANS ----------------*/
    /**
    * Save a new loan in user information.
    * @param {AvailableCards} newCard Contains information of new card.
    */
    public addLoan(options: LoanOptions, alias?: string) {
        options.alias = `Préstamo ${options.issuer.name} ${options.borrowed}`;
        if(alias) options.alias = alias; // in case user did set an alias manually
        this.loans.push(new Loan(options));
    }
    /**
    * Helper function that verifies that the given loan does really exist in user information.
    * @param {string} alias Loan alias to search for.
    */
    public hasLoan(alias: string) {
        return this.getLoanIndex(alias) < 0 ? false : true;
    }
    /**
    * Helper function that obtains the index of the given loan alias.
    * @param {string} alias Loan alias to search for.
    */
    public getLoanIndex(alias: string) {
        return this.loans.map((l) => l.getAlias()).indexOf(alias);
    }
    /**
    * Get stored user loan.
    * @param {number} index Position of the loan in user array.
    */
    public getLoan(index: number) {
        return this.loans[index];
    }
    /**
    * Delete loan from user data.
    * @param {number} index Array index of the selected loan.
    */
    public removeLoan(index: number) {
        if(index < this.loans.length || index > this.loans.length) { throw new Error("Loan index out of bounds."); }
        const deleted = this.loans.splice(index, 1);
        console.log("The following loan was deleted correctly: " + deleted[0].getAlias());
    }


    /*---------------- CATEGORIES ----------------*/
    /**
    * Save a new expense category in user information.
    * @param {ExpenseCategory} newCategory Contains information of new expense category.
    */
    public addCategory(newCategory: ExpenseCategory) {
        this.expenseCategories.push(newCategory);
    }
    /**
    * Helper function that obtains the desired expense category using it's alias.
    * @param {string} alias Expense category alias to search for.
    */
    public getCategory(alias: string) {
        return this.expenseCategories.find((ec) => ec.alias === alias);
    }
    /**
    * Get all stored user expense categories.
    */
    public getCategories() {
        return this.expenseCategories;
    }
    /**
    * Delete expense category from user data.
    * @param {number} index Array index of the selected expense category.
    */
    public removeCategory(index: number) {
        if(index < this.expenseCategories.length || index > this.expenseCategories.length) { throw new Error("Category index out of bounds."); }
        const deleted = this.expenseCategories.splice(index, 1);
        console.log("The following expense category was deleted correctly: " + deleted[0].alias);
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
