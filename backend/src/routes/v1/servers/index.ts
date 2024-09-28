import { InstanceEndpoint, Server } from "@common/types/servers";
import { Router } from "express";

export const usProd = "https://www.google.com";

const router = Router();

/**
* @swagger
* /api/v1/servers:
*   get:
*       summary: Get ELM servers.
*       description: Fetch all available ELM servers.
*       tags:
*           - Servers
*       responses:
*           200:
*               description: A list of all available ELM servers
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Servers'
*/
router.get("/", (_, res) => {
    const endpointOne: InstanceEndpoint = {
        id: "1",
        name: "Endpoint 1 (rm/ccm/qm)"
    };
    const endpointTwo: InstanceEndpoint = {
        id: "2",
        name: "Endpoint 2 (rm2/ccm2)",
    };

    const servers: Server[] = [
        {
            id: "us-prod",
            name: "US Production",
            url: usProd,
            location: "us",
            endpoints: [ endpointOne, endpointTwo ]
        }
    ];

    const serverRes = [];
    for(const server of servers) {
        if(server.location === process.env.ENV_LOCATION) {
            serverRes.push(server);
        }
    }

    const response = {
        serverRes
    };

    return res.status(200).json(response);
});

export default router;
