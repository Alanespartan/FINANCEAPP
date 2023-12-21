import { requireSession } from "@src/middleware/checkConnection";
import { MyRouter }   from "../MyRouter";
import authRouter     from "./auth";
import paymentsRouter from "./payments"
import cardsRouter    from "./cards";

const v1Router = new MyRouter();

v1Router.use("/", authRouter.getRouter());

v1Router.use("/payments", requireSession, paymentsRouter.getRouter());

v1Router.use("/cards", requireSession, cardsRouter.getRouter());

export default v1Router;