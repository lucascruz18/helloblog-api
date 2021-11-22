import { SignUpController } from '@/presentation/controllers/users/SignupController'
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors'
import {
  UserModel,
  AddUser,
  AddUserModel,
  Validation
} from '@/presentation/controllers/users/UsersProtocols'
import { HttpRequest } from '@/presentation/protocols'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helpers'

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add (account: AddUserModel): Promise<UserModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddUserStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email@mail.com',
  bio: 'any_bio',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    bio: 'any_bio',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  addUserStub: AddUser
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addUserStub = makeAddUser()
  const validationStub = makeValidation()
  const sut = new SignUpController(addUserStub, validationStub)
  return {
    sut,
    addUserStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addUserStub } = makeSut()
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addUserStub } = makeSut()
    const AddSpy = jest.spyOn(addUserStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(AddSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      bio: 'any_bio',
      password: 'any_password'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addUserStub } = makeSut()
    jest.spyOn(addUserStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    const data = {
      user: {
        id: 1,
        name: 'valid_name',
        email: 'valid_email@mail.com',
        bio: 'any_bio',
      },
    }
    expect(httpResponse).toEqual(ok(data))
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
