import { Sequelize } from 'sequelize-typescript';
import config from '../config';

// prod
const sequelize = new Sequelize(config.db.connectionString, {
  repositoryMode: true,
  models: [__dirname + '/models'],
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },
}); // Example for postgres

// dev
// const sequelize = new Sequelize(config.db.connectionString, {
//   repositoryMode: true,
//   models: [__dirname + '/models'],
// }); // Example for postgres

export async function initDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    // eslint-disable-next-line no-console
    console.log('Sync completed.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialized database:', error);
    process.exit(1);
  }
}

export async function closeDb() {
  try {
    await sequelize.authenticate();
    await sequelize.close();
    // eslint-disable-next-line no-console
    console.log('close completed.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to close database connection:', error);
    process.exit(1);
  }
}

export default sequelize;
