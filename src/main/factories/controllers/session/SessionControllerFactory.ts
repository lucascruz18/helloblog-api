import { Controller } from '../../../../presentation/protocols/controller'
import { SessionController } from '../../../../presentation/controllers/session/SessionController'
import { makeSessionValidation } from './SessionValidationFactory'
import { makeDbAuthentication } from '../../usecases/authentication/DbAuthenticationFactory'

export const makeSessionController = (): Controller => {
  return new SessionController(makeDbAuthentication(), makeSessionValidation())
}
