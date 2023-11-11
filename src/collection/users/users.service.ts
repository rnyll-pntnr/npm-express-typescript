import { Service } from "typedi"
import UsersRepository from "./users.repository";
import { BadRequestError } from "routing-controllers";
import { ObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

@Service()
export default class UsersService {
    constructor(private readonly usersRepo: UsersRepository) { }

    async getAll() {
        return await this.usersRepo.getAll()
    }

    async create(
        req: any
    ) {
        try {
            const {
              email,
              name,
              password,
              confirm_password
            } = req
      
            if (!email || !name || !confirm_password) {
              throw 'Conplete all the fields to continue.'
            }
      
            if (password.lenght <= 7) {
              throw 'Password length must at least 8 characters.'
            }
      
            if (password !== confirm_password) {
              throw 'Enter the same password twice to continue.'
            }
      
            const checkDuplicateUser = await this.usersRepo.checkDuplicate(email)

            if (!checkDuplicateUser) throw 'Email address already taken.'

            const createdUser = await this.usersRepo.create(req)

            if (!createdUser) throw 'Failed to save user to database.'

            return {
                message: 'User successfully creted',
                data: createdUser
            }
        } catch (error) {
          throw new BadRequestError(error.message || 'Failed to create user.')
        }
    }

    async deleteRecordById(
        id: ObjectId
    ) {
        return await this.usersRepo.deleteRecordById(id)
    }
    
    async login(
      req: any,
      res: any
    ) {
      try {
        const { email, password } = req
  
        if (!email) throw 'Email is requied'

        if (!password) throw 'Password is required'
  
        if (password.length <= 7) {
            throw 'Password length must at least 8 characters.'
        }
  
        const existingUser: any = await this.usersRepo.getUserByEmail(email)

        if (existingUser === null) {
            throw 'Wrong email or password.'
        }
  
        const comparePassword = await bcrypt.compare(password, existingUser.password)
  
        if (!comparePassword) {
            throw 'Wrong email or password.'
        }
  
        const accessToken = jwt.sign({
            user: existingUser
        }, (process.env.JWT_TOKEN ?? 'JWT_TOKEN'), {
            expiresIn: '3600s'
        })
  
        res.cookie('jwt-token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        return {
          data: existingUser,
          _token: accessToken 
        }
  
      } catch (error) {
        throw new BadRequestError(error || 'Failed to sign-in')
      }
    }
}