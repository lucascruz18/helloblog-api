import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/users/SignupControllerFactory'
import { adaptRoute } from '../adapters/express/ExpressRouteAdapter.'

export default (router: Router): void => {
  router.post('/users', adaptRoute(makeSignUpController()))
}
