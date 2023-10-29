import { closeDb } from '../../src/db/sequelize';

module.exports = async () => {
  await closeDb();
};
