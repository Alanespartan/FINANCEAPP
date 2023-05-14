/**
 * This class server as an in-memory store of users connections.
 * We do not put these in the session object since they're not serializable.
 */
export class ConnectionStore {
    private static STORE = new Map<string, string>();

    public static hasConnection(sid: string): boolean {
        return ConnectionStore.STORE.has(sid);
    }

    public static getConnection(sid: string) {
        return ConnectionStore.STORE.get(sid);
    }

    public static setConnection(sid: string, userId: any) {
        ConnectionStore.STORE.set(sid, userId);
    }

    public static deleteConnection(sid: string) {
        ConnectionStore.STORE.delete(sid);
    }
}