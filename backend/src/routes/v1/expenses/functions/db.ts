/* eslint-disable @typescript-eslint/no-explicit-any */
import { expenseTypeStore } from "@db";

export async function getUserExpenseTypes(userId: number) {
    return await expenseTypeStore.find({
        where: {
            user: {
                id: userId
            }
        }
    });
}
