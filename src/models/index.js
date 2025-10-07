import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false
    }
);

import Ticket from "./ticket.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Ticket = Ticket(sequelize);

export default db;
