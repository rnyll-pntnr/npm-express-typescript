import { BadRequestError } from 'routing-controllers'
import { Service } from "typedi"
import User from "./users.model"
import bcryptjs from 'bcryptjs'
import { ObjectId } from 'mongoose'

@Service()
export default class UsersRepository {
  async getAll() {
    const users = await User.find()

    return {
      message: "Get all users",
      data: users.map((data) => data.toJSON()),
    };
  }

  async checkDuplicate(email: String): Promise<Boolean> {
    try {
      const user = await User.findOne({ email: email })

      if (!user) return true

      return false
    } catch (error) {
      return false
    }
  }

  async getUserByEmail(
    email: String
  ) {
    try {
      const user = await User.findOne({ email: email })

      if (!user) throw 'User not found'

      return user?.toJSON()
    } catch (error) {
      throw new BadRequestError(error || error.message)
    }
  }

  async create(req: any): Promise<any> {
    try {
      const {
        email,
        name,
        password
      } = req

      const salt = await bcryptjs.genSalt()
      const hashPassword = await bcryptjs.hash(password, salt)

      const createUser = await new User({
        email: email,
        name: name,
        password: hashPassword
      }).save()

      return createUser.toJSON()
    } catch (error) {
      return null
    }
  }

  async deleteRecordById(
    id: ObjectId
  ) {
    try {
      const deleteRecord = await User.deleteOne({
        _id: id
      })
      console.log(deleteRecord)

      return undefined
    } catch (error) {
      return null
    }
  }
}
