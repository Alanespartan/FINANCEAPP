import path from "path";
import * as dotenv from "dotenv";
// Load .env in Test Setup Code
dotenv.config({
    path: path.resolve(__dirname, "..", "..", ".env")
});
