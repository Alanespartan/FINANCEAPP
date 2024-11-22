// https://aws.amazon.com/es/rds/free/
import { ServerError } from "@backend/lib/errors";
import { DataSource, DataSourceOptions } from "typeorm";

const type = "postgres";
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host     = process.env.DB_HOST;
const port     = parseInt(process.env.DB_PORT ?? "0");
const database = process.env.DB_NAME;

if(!username) throw new ServerError("Must provide a username environment variable");
if(!password) throw new ServerError("Must provide a password environment variable");
if(!host)     throw new ServerError("Must provide a host environment variable");
if(port <= 0) throw new ServerError("Must provide a port environment variable");
if(!database) throw new ServerError("Must provide a database environment variable");

const TypeORMConfig: DataSourceOptions = {
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: true,
    entities: [
        "../lib/cards/*.ts",
    ],
    subscribers: [],
    migrations: []
};

const AppDataSource = new DataSource(TypeORMConfig);

export default AppDataSource;
