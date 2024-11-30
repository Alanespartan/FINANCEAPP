/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCardPayload } from "@common/types/cards";
import { cardStore } from "@db";
import { filterNonNullableAttributes } from "./util";

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
            bank: {
                id: bankId
            }
        }
    });
}

export async function getUserCards(userId: number) {
    return await cardStore.find({
        where: {
            user: {
                id: userId
            }
        }
    });
}

/**
* Saves a given entity in the database card store. If entity does exist in the database it's updated, otherwise it's inserted.
* @param {Card} toSave Card object used to overwrite existing entry or create a new one.
*/
export async function saveCard(toSave: any) {
    await cardStore.save(toSave);
}

/**
* Updates entity partially using a given set of attributes.
* It uses "TypeORMEntity.update()" instead of "TypeORMEntity.save()".
* It executes fast and efficient UPDATE query.
* Does not check if entity exist in the database.
*/
export async function updateCard(cardId: number, options: UpdateCardPayload) {
    // build payload to update card from non null/undefined options
    const payload = filterNonNullableAttributes(options);
    await cardStore.update(cardId, payload);
}
