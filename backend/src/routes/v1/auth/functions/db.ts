/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@errors";
import { User, Bank } from "@entities";
import { userStore, bankStore } from "@db";

export async function createUser(email: string, password: string, firstName: string, lastName: string) {
    const foundUser = await getByEmail(email);
    if(foundUser) {
        throw new BadRequestError(`An account with "${email}" email already exists.`);
    }
    await userStore.save(new User(email, password, firstName, lastName));
    // TODO BANK move these to another file and create its proper tests
    await bankStore.save(new Bank("BBVA", "México"));
}

export async function getById(id: number) {
    return await userStore.findOne({
        where: {
            id: id
        }
    });
}

export async function getByEmail(email: string) {
    return await userStore.findOne({
        where: {
            email: email
        }
    });
}

/** Deletes a user from the database.
 *
 * Read more at: https://stackoverflow.com/questions/54246615/what-s-the-difference-between-remove-and-delete
 */
export async function discard(id: number) {
    const foundUser = await getById(id);
    if(!foundUser) {
        throw new BadRequestError(`No account with "${id}" id was found to delete.`);
    }
    await userStore.delete(id);
}

