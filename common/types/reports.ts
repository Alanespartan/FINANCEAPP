import { Expense } from "types/payments";

/* Show how my finances behave in a month */
export interface MonthlySummary{
    id: string;
    month: string;
    year: string;
    monthlyIncome: number;
    monthlyExpenses: number;
    expenses: Expense[];
    incomes: any[];
}