/* eslint-disable @typescript-eslint/no-explicit-any */
import { TExpenseType } from "@common/types/expenses";
import { expenseTypeStore } from "@db";
import { ExpenseType } from "@entities";

export async function createExpenseType(toSave: ExpenseType) {
    await expenseTypeStore.save(toSave);
}

export async function getUserExpenseTypes(userId: number) {
    return await expenseTypeStore.find({
        where: {
            user: {
                id: userId
            }
        }
    });
}

export async function getUserExpenseTypesByType(userId: number, filter: TExpenseType) {
    return await expenseTypeStore.find({
        where: {
            userId: userId,
            type: filter
        }
    });
}

export async function getExpenseTypeById(expenseTypeId: number) {
    return await expenseTypeStore.findOne({
        where: {
            id: expenseTypeId
        }
    });
}

export async function getByFilters(conditions: any) { // TODO EXPENSE TYPES create interface to define potencial non undefined properties to search for
    return await expenseTypeStore.find({ where: conditions });
}
