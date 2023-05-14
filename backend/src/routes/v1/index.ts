import { MyRouter } from "../MyRouter";
import authRouter from "./auth";

const v1Router = new MyRouter();

v1Router.use("/", authRouter.getRouter());

export default v1Router;