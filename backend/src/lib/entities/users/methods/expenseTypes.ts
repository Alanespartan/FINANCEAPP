import { User, ExpenseType } from "@entities";

export function addExpenseType(this: User, toAdd: ExpenseType) {
    this.expenseTypes.push(toAdd);
}

export function hasExpenseType(this: User, toSearch: string): boolean {
    return this.expenseTypes.find((et) => et.name === toSearch) ? true : false;
}

export function getExpenseType(this: User, name: string) {
    return this.expenseTypes.find((ec) => ec.name === name);
}

export function getExpenseTypes(this: User) {
    return this.expenseTypes;
}
