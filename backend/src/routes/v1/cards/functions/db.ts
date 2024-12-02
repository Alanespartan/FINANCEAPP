/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCardPayload } from "@common/types/cards";
import { cardStore, bankStore } from "@db";
import { filterNonNullableAttributes } from "./util";
import { Card } from "@backend/lib/entities";

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

/** Get a bank entity from db using the given id
 * TODO BANK move this to dedicated file
 * @param bankId
 * @returns The desired bank information
 */
export async function getBank(bankId: number) {
    return await bankStore.findOne({
        where: {
            id: bankId
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
* @returns The saved card entity instance containing the id generated by the database.
*/
export async function saveCard(toSave: Card) {
    return await cardStore.save(toSave);
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
