import { UserModel } from '../models/User'

export interface AddUserModel {
  name: string
  email: string
  bio?: string
  password: string
}

export interface AddUser {
  add (account: AddUserModel): Promise<UserModel>
}
