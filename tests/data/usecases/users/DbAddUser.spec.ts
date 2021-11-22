import { DbAddUser } from '@/data/usecases/users/DbAddUser'
import {
  Hasher,
  AddUserModel,
  UserModel,
  AddUserRepository,
  LoadUserByEmailRepository
} from '@/data/usecases/users/DbAddUserProtocols'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add (accountData: AddUserModel): Promise<UserModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddUserRepositoryStub()
}

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail (email: string): Promise<UserModel> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

const makeFakeAccount = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email@mail.com',
  bio: 'any_bio',
  password: 'hashed_password'
})

const makeFakeUserData = (): AddUserModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  bio: 'any_bio',
  password: 'valid_password'
})

interface SubTypes {
  sut: DbAddUser
  hasherStub: Hasher
  addUserRepositoryStub
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
}

const makeSut = (): SubTypes => {
  const hasherStub = makeHasher()
  const addUserRepositoryStub = makeAddUserRepository()
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository()
  const sut = new DbAddUser(hasherStub, addUserRepositoryStub, loadUserByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addUserRepositoryStub,
    loadUserByEmailRepositoryStub
  }
}

describe('DbAddUser Usercase', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeUserData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addUserRepositoryStub, 'add')
    await sut.add(makeFakeUserData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      bio: 'any_bio',
      password: 'hashed_password'
    })
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    jest.spyOn(addUserRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeUserData())
    await expect(account).toEqual(makeFakeAccount())
  })

  test('Should return null if LoadUserByEmailRepository not return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeAccount())))
    const account = await sut.add(makeFakeUserData())
    await expect(account).toBe(null)
  })

  test('Should call LoadAccountByUserRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeUserData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
