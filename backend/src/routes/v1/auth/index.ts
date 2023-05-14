import { MyRouter } from "src/routes/MyRouter";
import { handleLoginRequest } from "src/lib/auth/login";
import { handleLogoutRequest } from "src/lib/auth/logout";

const router = new MyRouter();

router.post("/login", handleLoginRequest);

router.post("/logout", handleLogoutRequest);

export default router;