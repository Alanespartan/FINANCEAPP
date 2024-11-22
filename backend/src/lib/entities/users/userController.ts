/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Logger } from "@common/types/logger";
import { randomUUID } from "crypto";
import { User } from "./user";

export class UserController {
    // mimic a database storage
    userStore: Record<string, User> = {};

    // const userRepository = MyDataSource.getRepository(User);

    public create(email: string, password: string, firstName: string, lastName: string) {
        const id = randomUUID();
        if(!this.userStore[id]) this.userStore[id] = new User(email, password, firstName, lastName);
    }

    public get(id: string) {
        if(this.userStore[id]) return this.userStore[id];
        return undefined;
    }

    public getByEmail(email: string) {
        // dbConnection.query()

        for(const key in this.userStore) {
            const user = this.userStore[key];
            if(email === user.email) return user;
        }
        return undefined;
    }

    public discard(id: string) {
        return delete this.userStore[id];
    }
}

export const userController = new UserController();
userController.create("test@gmail.com", "admin", "John", "Doe");
