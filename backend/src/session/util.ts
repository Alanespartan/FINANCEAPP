import { ServerError } from "@errors";
import { Request } from "express";

export function clearSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if(err) {
                console.error("An error has occured trying to logout");
                console.error(err);
                reject(new ServerError("There was an unexpected error trying to log out"));
            } else {
                resolve();
            }
        });
    });
}