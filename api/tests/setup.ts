import { initDb } from '../src/db/sequelize';

module.exports = async () => {
  await initDb();
};
