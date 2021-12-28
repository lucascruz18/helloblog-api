import { makeSessionValidation } from './SessionValidationFactory'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { EmailValidator } from '../../../../validation/protocols'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('loginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSessionValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
