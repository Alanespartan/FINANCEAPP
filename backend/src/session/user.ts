import { randomUUID } from "crypto";
import { UserSession } from "@common/types/auth";
import { CardOptions, CardTypes } from "@common/types/cards";
import { CreditCard, DebitCard } from "../lib/cards";
import { Loan } from "../lib/loans";
import { Expense, ExpenseCategory } from "@common/types/payments";
import { LoanOptions } from "@common/types/loans";

export class UserController {
    // mimic a database storage
    userStore: Record<string, User> = {};
    
    public create(email: string, password: string, firstName: string, lastName: string) {
        const id = randomUUID();
        if(!this.userStore[id]) this.userStore[id] = new User(id, email, password, firstName, lastName);
    }

    public get(id: string) {
        if(this.userStore[id]) return this.userStore[id];
        return undefined;
    }

    public getByEmail(email: string) {
        // TODO query against DB using email
        for(const key in this.userStore) {
            const user = this.userStore[key];
            if(email === user.email) return user;
        }
        return undefined;
    }

    public discard(id: string) {
        return delete this.userStore[id];
    }
}

export type AvailableCards = DebitCard | CreditCard;

export class User implements UserSession {
    public readonly id: string;
    public readonly email: string;
    public readonly password: string;
    public readonly firstName: string;
    public readonly lastName: string;
    protected cards: AvailableCards[];
    protected cash: number;
    protected loans: Loan[];
    protected expenses: Expense[];
    protected expenseCategories: ExpenseCategory[];
    protected incomes: any[]; // todo create interface

    constructor(id: string, email: string, password: string, firstName: string, lastName: string) {
        // BASIC USER INFO
        this.id        = id;
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
                name:      "Other",
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
    public addCard(newCard: AvailableCards) {
        this.cards.push(newCard);
    }
    /**
    * Helper function that verifies that a given card does really exist in user information.
    * @param {string} alias Card alias to search for.
    */
    public hasCard(alias: string) {
        return this.cards.map((c) => c.getAlias()).indexOf(alias) < 0 ? false : true;
    }
    /**
    * Get stored user card.
    * @param {boolean} useIndex Specify if function call must use index or card alias to get card from array.
    * @param {number|string} searchFor Can be either the index or the card alias.
    */
    public getCard(useIndex: boolean, searchFor: number | string) {
        if(!useIndex) return this.cards.filter((c) => c.getAlias() === searchFor as string)[0];
        return this.cards[(searchFor as number)];
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
    * Helper function that verifies that a given loan does really exist in user information.
    * @param {string} alias Loan alias to search for.
    */
    public hasLoan(loanName: string) {
        return this.loans.map((l) => l.getAlias()).indexOf(loanName) < 0 ? false : true;
    }
    /**
    * Get stored user loan.
    * @param {boolean} useIndex Specify if function call must use index or loan alias to get loan from array.
    * @param {number|string} searchFor Can be either the index or the loan alias.
    */
    public getLoan(useIndex: boolean, searchFor: number | string) {
        if(!useIndex) return this.loans.filter((l) => l.getAlias() === searchFor as string)[0];
        return this.loans[(searchFor as number)];
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



    /*---------------- EXPENSES ----------------*/
    public createExpenseCategory(newCategory: ExpenseCategory) {
        this.expenseCategories.push(newCategory);
    }
    public removeExpenseCategory(index: number) {
        // all existing expenses with this category should be assigned to "Other"
        this.expenses
            .filter((expense) => expense.category.id)
            .forEach((filtered) => filtered.category = this.expenseCategories[0]); // 0 is always default
        const deleted = this.expenseCategories.splice(index, 1);
        console.log("The following category was deleted correctly: " + deleted[0].name);
    }
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
            },
            cards:    this.cards,
            expenses: this.expenses,
            loans:    this.loans,
            incomes:  this.incomes
        };
        return JSON.stringify(userObj);
    }
}

export const userController = new UserController();

/* 
PUBLIC
By default, all members of a class in TypeScript are public.
All the public members can be accessed anywhere without any restrictions.

PRIVATE
The private access modifier ensures that class members are visible only to 
that class and are not accessible outside the containing class.

PROTECTED
The protected access modifier is similar to the private access modifier,
except that protected members can be accessed using their deriving classes.

STATIC
class Circle {
    static pi = 3.14;
    pi = 3;
}
Circle.pi; // returns 3.14
let circleObj = new Circle();
circleObj.pi; // returns 3
Static and non-static fields with the same name can exists without any error.
The static field will be accessed using dot notation and the non-static field
can be accessed using an object.
*/