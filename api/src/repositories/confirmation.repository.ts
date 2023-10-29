import { Repository } from 'sequelize-typescript';
import sequelize from '../db/sequelize';
import Confirmation from '../db/models/Confirmation';
import { Confirmation as IConfirmation } from '../types/Auth';

export class ConfirmationRepository {
  repository: Repository<Confirmation>;

  constructor() {
    this.repository = sequelize.getRepository(Confirmation);
  }

  findByPk(id: string) {
    return this.repository.findByPk(id);
  }

  create(confirm: Partial<IConfirmation>) {
    confirm.code = this.generateCode();
    return this.repository.create(confirm);
  }

  private generateCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
