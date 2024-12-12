import { User } from "./users/user";
import { Card } from "./cards/card";
import { Loan } from "./loans/loan";
import { Bank } from "./banks/bank";
import { ExpenseCategory } from "./expenses/expenseCategory";
import { ExpenseSubCategory } from "./expenses/expenseSubCategory";

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type MixinsConstructor<T = {}> = new (...args: any[]) => T;

export {
    User,
    Card,
    Loan,
    Bank,
    ExpenseCategory,
    ExpenseSubCategory,
    MixinsConstructor
};
