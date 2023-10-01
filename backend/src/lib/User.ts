import { Card } from "./cards/";
import { Expense, PaymentOptions } from "@common/types/payments";
import { randomUUID } from "crypto";

export class FinanceUser {
    protected id: string;
    protected cards: Card[];
    protected cash: number;
    protected loans: any[]; // todo create interface
    protected expenses: Expense[];
    protected incomes: any[]; // todo create interface

    constructor(id: string) {
        this.id       = id;
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
            amount: options.amount,
            paymentDate: options.paymentDate,
            comment: options.comment
        } as Expense;
        
        // perform pay according to options (what i'm paying for, what method of payment did I use, etc.)
    }

    public addBalance(amount: number) {
        // todo add new balanace to existing card, cash or any method used to pay
        console.log(amount);
    }
}