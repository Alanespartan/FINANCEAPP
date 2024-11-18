import { User } from "@backend/session/user";

/**
 * This class server as an in-memory store of users connections.
 * We do not put these in the session object since they're not serializable.
 */
export class ConnectionStore {
    private static STORE = new Map<string, User>();

    public static hasConnection(sid: string): boolean {
        return ConnectionStore.STORE.has(sid);
    }

    public static getConnection(sid: string) {
        return ConnectionStore.STORE.get(sid);
    }

    public static setConnection(sid: string, userData: User) {
        console.log(`Set connection for ${sid} at ${new Date().toISOString()}`);
        ConnectionStore.STORE.set(sid, userData);
    }

    public static deleteConnection(sid: string) {
        console.log(`Deleting connection for ${sid} at ${new Date().toISOString()}`);
        ConnectionStore.STORE.delete(sid);
    }
}

