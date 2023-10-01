import { Card, CreditCard, DebitCard } from "../lib/cards";
import { Expense, PaymentOptions } from "@common/types/payments";
import { randomUUID } from "crypto";

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

    public discard(id: string) {
        return delete this.userStore[id];
    }
}

type AvailableCards = Card | DebitCard | CreditCard;

export class User {
    public readonly id: string;
    public readonly email: string;
    public readonly password: string;
    public readonly firstName: string;
    public readonly lastName: string;
    protected cards: AvailableCards[];
    protected cash: number;
    protected loans: any[]; // todo create interface
    protected expenses: Expense[];
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
    }

    public pay(options: PaymentOptions){
        const id = randomUUID();

        const newExpense = {
            id,
            amount:      options.amount,
            type:        options.type,
            paymentDate: options.paymentDate,
            comment:     options.comment
        } as Expense;
        
        if(options.method.isCash) {
            this.cash -= options.amount;
        } else if(options.method.isCard) {
            const selectedCard = this.cards.filter((card) => card.alias === options.method.name)[0];
            selectedCard
        } else {
            // todo define what to do with other - mercado pago - caja de ahorro/fondo de ahorro
        }
    }

    public addBalance(amount: number) {
        // todo add new balanace to existing card, cash or any method used to pay
        console.log(amount);
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