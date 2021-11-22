import { getRepository, Repository } from 'typeorm';

import User from '../../entities/User'

import { UserModel } from '@/domain/models/User'
import { AddUserModel } from '@/domain/usecases/AddUser'

import { AddUserRepository } from '@/data/protocols/db/users/AddUserRepository'
import { LoadUserByEmailRepository } from '@/data/protocols/db/users/LoadUserByEmailRepository'

export class UsersRepository implements AddUserRepository, LoadUserByEmailRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async add(userData: AddUserModel): Promise<UserModel> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    if (!user) {
      return null
    }

    return user;
  }

  public async loadByEmail(email: string): Promise<UserModel> {
    const user = this.ormRepository.findOne({
      where: {
        email
      }
    })

    return user
  }
}
