import { Router } from 'express'
import { makeSessionController } from '../factories/controllers/session/SessionControllerFactory'
import { adaptRoute } from '../adapters/express/ExpressRouteAdapter.'

export default (router: Router): void => {
  router.post('/sessions', adaptRoute(makeSessionController()))
}
