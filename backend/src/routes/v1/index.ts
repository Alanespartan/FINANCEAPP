import { MyRouter } from "../MyRouter";
import authRouter from "./auth";
import paymentsRouter from "./payments"
import { requireSession } from "@src/middleware/checkConnection";

const v1Router = new MyRouter();

v1Router.use("/", authRouter.getRouter());

v1Router.use("/payments", requireSession, paymentsRouter.getRouter())

export default v1Router;