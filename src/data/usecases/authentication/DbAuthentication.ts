import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/HashComparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadUserByEmailRepository } from '../../protocols/db/users/LoadUserByEmailRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadUserByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        return accessToken
      }
    }
    return null
  }
}
