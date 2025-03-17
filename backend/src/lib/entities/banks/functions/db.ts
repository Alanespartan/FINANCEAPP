import { bankStore } from "@db";
import { MoreThan } from "typeorm";
import { Bank } from "@entities";

/** Get a bank entity from db using the given id
 * @param bankId
 * @returns {Promise<Bank | null>} The desired bank information
 */
export async function getBank(bankId: number): Promise<Bank | null> {
    return await bankStore.findOne({
        where: {
            id: bankId
        }
    });
}

/** Get all bank entities from db
 * @returns {Promise<Bank[]>} An array of all banks information
 */
export async function getBanks(): Promise<Bank[]> {
    return await bankStore.find({
        where: {
            id: MoreThan(0)
        }
    });
}
