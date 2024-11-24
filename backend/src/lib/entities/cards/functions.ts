import { cardStore } from "@db";

export async function getByCardNumber(cardNumber: string) {
    return await cardStore.findOne({
        where: {
            cardNumber: cardNumber
        }
    });
}

export async function getByBank(bankId: number) {
    return await cardStore.find({
        where: {
            issuer: {
                id: bankId
            }
        }
    });
}

export async function getUserCards(userId: number) {
    return await cardStore.find({
        where: {
            owner: {
                id: userId
            }
        }
    });
}
