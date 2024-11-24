// https://aws.amazon.com/es/rds/free/
import { ServerError } from "@backend/lib/errors";
import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "@common/types/logger";

const logger = new Logger();

const type     = "postgres";
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

import { User } from "../lib/entities/users/user";
import { Card } from "../lib/entities/cards/card";
import { Loan } from "../lib/entities/loans/loan";
import { Bank } from "../lib/entities/banks/bank";

logger.info("Creating TypeORM Connection...");
logger.info(`Type: ${type}`);
logger.info(`Username: ${username}`);
logger.info(`Host: ${host}`);
logger.info(`Port: ${port}`);
logger.info(`Database Name: ${database}`);

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
        User,
        Card,
        Loan,
        Bank
    ],
    subscribers: [],
    migrations: []
};

const DBContextSource = new DataSource(TypeORMConfig);

// https://www.npmjs.com/package/typeorm
// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
DBContextSource.initialize()
    .then(() => {
        logger.info("DB connection successfully established!");
        logger.info(`Entities loaded: ${DBContextSource.entityMetadatas.map((e) => e.name)}`);
    })
    .catch((error) => console.log(error));

export default DBContextSource;
