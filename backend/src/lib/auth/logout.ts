import { RequestHandler } from "express";
import { ConnectionStore } from "src/session/connectionStore";

/**
 * Logs a user out.
 * @param {Request} req Request object.
 * @param {Response} res Response object.
 */

export const handleLogoutRequest: RequestHandler = async (req, res) => {
    ConnectionStore.deleteConnection(req.sessionID);
    res.status(200).json({ status: "success" });
}