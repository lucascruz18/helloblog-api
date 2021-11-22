import {
  AddUser,
  AddUserModel,
  UserModel,
  Hasher,
  AddUserRepository,
  LoadUserByEmailRepository
} from './DbAddUserProtocols'

export class DbAddUser implements AddUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository
  ) {}

  async add (userData: AddUserModel): Promise<UserModel> {
    const userExist = await this.loadUserByEmailRepository.loadByEmail(userData.email)

    if (userExist) {
      return null
    }

    const hashedPassword = await this.hasher.hash(userData.password)

    const user = await this.addUserRepository.add(Object.assign({}, userData, { password: hashedPassword }))

    return user
  }
}
