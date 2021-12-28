import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation
} from './SessionProtocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helpers'

export class SessionController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body)

      if (errorValidation) {
        return badRequest(errorValidation)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
