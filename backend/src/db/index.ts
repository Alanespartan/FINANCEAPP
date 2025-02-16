// https://aws.amazon.com/es/rds/free/
import { ServerError } from "@errors";
import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "@common/types/logger";

const logger = new Logger();

const type       = "postgres";
const username   = process.env.DB_USER;
const password   = process.env.DB_PASSWORD;
const host       = process.env.DB_HOST;
const port       = parseInt(process.env.DB_PORT ?? "0");
const database   = process.env.DB_NAME;
// customize typeorm flags according to .env values
const dropSchema = process.env.NODE_ENV  === "production" ? false : true;
const logging    = process.env.LOG_LEVEL === "trace" ? true : false;

if(!username) throw new ServerError("Must provide a username environment variable");
if(!password) throw new ServerError("Must provide a password environment variable");
if(!host)     throw new ServerError("Must provide a host environment variable");
if(port <= 0) throw new ServerError("Must provide a port environment variable");
if(!database) throw new ServerError("Must provide a database environment variable");

import { User, Card, Loan, Bank, ExpenseCategory, ExpenseSubCategory } from "@entities";

if(logging && (!User || !Card || !Loan || !Bank || !ExpenseCategory || !ExpenseSubCategory)) {
    console.log("User Class:", User);
    console.log("Card Class:", Card);
    console.log("Loan Class:", Loan);
    console.log("Bank Class:", Bank);
    console.log("ExpenseCategory Class:", ExpenseCategory);
    console.log("ExpenseSubCategory Class:", ExpenseSubCategory);
    throw new ServerError("An error occurred trying to import some entities");
}

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
    logging,
    dropSchema,
    entities: [ User, Card, Bank, Loan, ExpenseCategory, ExpenseSubCategory ],
    subscribers: [],
    migrations: []
};

// https://www.npmjs.com/package/typeorm
// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
const DBContextSource = new DataSource(TypeORMConfig);
DBContextSource.initialize()
    .then(() => {
        logger.info("DB connection successfully established!");
        logger.info(`Entities loaded: ${DBContextSource.entityMetadatas.map((e) => e.name)}`);
        console.log(DBContextSource.getMetadata(Card).columns.map((col) => col.propertyName));
    })
    .catch((error) => console.log(error));

export const userStore = DBContextSource.getRepository(User);
export const cardStore = DBContextSource.getRepository(Card);
export const bankStore = DBContextSource.getRepository(Bank);
export const loanStore = DBContextSource.getRepository(Loan);
export const expenseCategoryStore    = DBContextSource.getRepository(ExpenseCategory);
export const expenseSubCategoryStore = DBContextSource.getRepository(ExpenseSubCategory);

export default DBContextSource;
