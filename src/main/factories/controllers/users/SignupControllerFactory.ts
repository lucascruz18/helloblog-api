import { SignUpController } from '../../../../presentation/controllers/users/SignupController'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignUpValidation } from './SignUpValidationFactory'
import { makeDbAddUser } from '../../usecases/users/DbAddUserfactory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddUser(), makeSignUpValidation())
  return controller
}
