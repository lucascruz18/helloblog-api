import {
  HttpRequest,
  HttpResponse,
  Controller,
  Validation,
  AddUser
} from './UsersProtocols'
import { badRequest, serverError, ok, forbidden } from '../../helpers/http/http-helpers'
import { EmailInUseError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly AddUser: AddUser,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const checkErrorValidation = this.validation.validate(httpRequest.body)

      if (checkErrorValidation) {
        return badRequest(checkErrorValidation)
      }

      const { name, email, bio, password } = httpRequest.body

      const user = await this.AddUser.add({
        name,
        email,
        bio,
        password
      })

      if (!user) {
        return forbidden(new EmailInUseError())
      }

      return ok({ user })
    } catch (error) {
      return serverError(error)
    }
  }
}
