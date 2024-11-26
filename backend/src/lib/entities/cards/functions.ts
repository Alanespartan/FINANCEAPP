/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCardPayload } from "@common/types/cards";
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

export async function updateCard(cardId: number, options: UpdateCardPayload) {
    const filterNonNullableAttributes = (options: UpdateCardPayload) => {
        // Create a new object with only defined keys
        return Object.entries(options).reduce((acc, [ key, value ]) => {
            if(value !== undefined && value !== null) {
                acc[key as keyof UpdateCardPayload] = value;
            }
            return acc;
        }, {} as any);
    };

    // build payload from non null/undefined options
    const payload = filterNonNullableAttributes(options);
    // Save the updated object
    await cardStore.update(cardId, payload);
}
