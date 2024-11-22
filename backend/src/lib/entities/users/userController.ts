/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@backend/lib/errors";
import { User } from "./user";
import DBContextSource from "@db";

class UserController {
    protected userStore = DBContextSource.getRepository(User);

    public async create(email: string, password: string, firstName: string, lastName: string) {
        const foundUser = await this.getByEmail(email);
        if(foundUser) {
            throw new BadRequestError(`An account with "${email}" email already exists.`);
        }
        this.userStore.create(new User(email, password, firstName, lastName));
    }

    public async getById(id: number) {
        return await this.userStore.findOne({
            where: {
                id: id
            }
        });
    }

    public async getByEmail(email: string) {
        return await this.userStore.findOne({
            where: {
                email: email
            }
        });
    }

    /** Deletes a user from the database.
     *
     * Read more at: https://stackoverflow.com/questions/54246615/what-s-the-difference-between-remove-and-delete
     */
    public async discard(id: number) {
        const foundUser = await this.getById(id);
        if(!foundUser) {
            throw new BadRequestError(`No account with "${id}" id was found to delete.`);
        }
        await this.userStore.delete(id);
    }
}

const userController = new UserController();

export default userController;
