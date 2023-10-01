import { CardOptions }                 from "@common/types/cards";
import { CardTypes }                   from "@common/types/cards";
import { Expense, PaymentOptions }     from "@common/types/payments";
import { CreditCard, DebitCard } from "../lib/cards";
import { randomUUID }                  from "crypto";

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

type AvailableCards = DebitCard | CreditCard;

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

        const paymentMethod = options.method;
        
        if(paymentMethod.isCash) {
            this.cash -= options.amount;
        } else if(paymentMethod.isCard && paymentMethod.cardOptions) {
            const index = this.cards.map(function(card) { return card.alias; }).indexOf(paymentMethod.alias);
            if(index < 0) { throw new Error(`${paymentMethod.alias} doesn't exist in user information.`); }
            
            const selectedCard = this.cards[index];
            
            if(paymentMethod.cardOptions.msi) {
                selectedCard.pay(options.amount, paymentMethod.cardOptions.msi);
            } else {
                selectedCard.pay(options.amount);
            }
        } else {
            // todo define what to do with other payment method
            // mercado pago, caja de ahorro/fondo de ahorro
        }
        
        this.expenses.push(newExpense);
    }

    public addIncome(amount: number) { // todo create incomeoptions interface
        // todo add new balanace to existing card, cash or any method used to pay
        console.log(amount);
    }

    public addCard(options: CardOptions, type: CardTypes, alias?: string) {
        let newCard: AvailableCards;
        switch(type) {
            case CardTypes.CREDIT:
                newCard = new CreditCard(options, options.limit ? options.limit : 0, this);
            break;
            case CardTypes.DEBIT:
                newCard = new DebitCard(options, false, this);
            break;
            case CardTypes.VOUCHER:
                newCard = new DebitCard(options, true, this);
            break;
        }
        if(alias) newCard.setAlias(alias);
        this.cards.push(newCard);
    }

    public removeCard() {
        // todo add logic here
        console.log("remove a card function call");
    }

    public addLoan() {
        // todo add logic here
        console.log("add a loan function call");
    }

    public removeLoan() {
        // todo add logic here
        console.log("remove a loan function call");
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