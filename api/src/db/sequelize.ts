import { Sequelize } from "sequelize-typescript";
import config from "../config";


const sequelize = new Sequelize(config.db.connectionString, {
    repositoryMode: true,
    models: [__dirname + "/models"]
}); // Example for postgres


export default sequelize;