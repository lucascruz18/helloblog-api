import { DbAddUser } from '../../../../data/usecases/users/DbAddUser'
import { BcryptAdapter } from '../../../../infra/criptography/bcryptAdapter/BcryptAdapter'
import { UsersRepository } from '../../../../infra/db/postgres/typeorm/repositories/users/UsersRepository'
import { AddUser } from '../../../../domain/usecases/AddUser'

export const makeDbAddUser = (): AddUser => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const usersRepository = new UsersRepository()
  return new DbAddUser(bcryptAdapter, usersRepository, usersRepository)
}
