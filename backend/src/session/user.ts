import { randomUUID } from "crypto";
import { UserSession } from "@common/types/auth";
import { CardOptions, CardTypes } from "@common/types/cards";
import { CreditCard, DebitCard } from "../lib/cards";
import { Expense, ExpenseCategory, PaymentMethod } from "@common/types/payments";

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

type AvailableCards = DebitCard | CreditCard;

export class User implements UserSession {
    public readonly id: string;
    public readonly email: string;
    public readonly password: string;
    public readonly firstName: string;
    public readonly lastName: string;
    protected cards: AvailableCards[];
    protected cash: number;
    protected loans: any[]; // todo create interface
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
        this.expenseCategories = [];
    }

    public doPayment(expense: Expense){        
        if(expense.method.type === PaymentMethod.CASH) {
            this.cash -= expense.total;
        } else if(expense.method.type === PaymentMethod.CARD) {
            this.getCard(this.hasCard(expense.method.name)).pay(expense.total)
        }

        // todo add logic to pay using cash or card a loan or a different card

        this.expenses.push(expense);
    }

    public addIncome(amount: number) { // todo create incomeoptions interface
        // todo add new balanace to existing card, cash or any method used to pay
        console.log(amount);
    }

    public addCard(options: CardOptions, type: CardTypes, alias?: string) {
        let newCard: AvailableCards;
        switch(type) {
            case CardTypes.CREDIT:
                options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new CreditCard(options, options.limit ? options.limit : 0);
            break;
            case CardTypes.DEBIT:
                options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new DebitCard(options, false);
            break;
            case CardTypes.VOUCHER:
                options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new DebitCard(options, true);
            break;
        }
        if(alias) newCard.setAlias(alias); // in case user did set an alias manually
        this.cards.push(newCard);
    }

    public hasCard(cardAlias: string) {
        return this.cards.map(function(card) { return card.alias; }).indexOf(cardAlias);
    }
    
    public removeCard(index: number) {
        const deleted = this.cards.splice(index, 1);
        console.log(deleted);
    }

    public getCard(index: number) {
        return this.cards[index];
    }

    public addLoan() {
        // todo add logic here
        console.log("add a loan function call");
    }

    public payLoan() {
        // todo add logic here
        console.log("pay a loan function call");
    }

    public removeLoan() {
        // todo add logic here
        console.log("remove a loan function call");
    }

    public createExpenseCategory(newCategory: ExpenseCategory) {
        this.expenseCategories.push(newCategory);
    }

    public removeExpenseCategory(index: number) {
        const deleted = this.expenseCategories.splice(index, 1);
        console.log(deleted);
        // TODO all existing expenses with this category should be assigned to "Other"
    }

    public user2Json() {
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
        return JSON.stringify(userObj)
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