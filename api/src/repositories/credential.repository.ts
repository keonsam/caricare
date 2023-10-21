import { Repository } from 'sequelize-typescript';
import Credential from '../db/models/Credential';
import sequelize from '../db/sequelize';
import { Credential as ICredential } from '../types/Auth';

export class CredentialRepository {
  repository: Repository<Credential>;

  constructor() {
    this.repository = sequelize.getRepository(Credential);
  }

  findByPk(id: string) {
    return this.repository.findByPk(id);
  }

  findByUsername(username: string) {
    return this.repository.findOne({ where: { username } });
  }

  create(auth: Omit<ICredential, 'id'>) {
    return this.repository.create(auth);
  }

  update(cred: Credential) {
    return this.repository.update(cred, { where: { id: cred.id } });
  }
}
