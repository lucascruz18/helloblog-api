import { AddUserModel } from '../../../../domain/usecases/AddUser'
import { UserModel } from '../../../../domain/models/User'

export interface AddUserRepository {
  add (userData: AddUserModel): Promise<UserModel>
}
