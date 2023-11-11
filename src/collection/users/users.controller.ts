import { JsonController, Get, Post, Body, Delete, Param, OnUndefined, Res, Authorized } from "routing-controllers";
import { Service } from "typedi";
import UsersService from "./users.service";
import { ObjectId } from 'mongoose'

@JsonController("/users")
@Service()
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async loginUsingEmailAndPassword(
    @Body() req: any,
    @Res() res: any
  ) {
    return this.usersService.login(req, res)
  }

  @Authorized()
  @Get("/")
  async getAll() {
    return this.usersService.getAll();
  }
  @Authorized()
  @Post('/')
  async create(
    @Body() req: any
  ) {
    return this.usersService.create(req);
  }
  
  @Authorized()
  @Delete('/:id')
  @OnUndefined(204)
  async deleteRecordById(
    @Param('id') id: ObjectId
  ) {
    return this.usersService.deleteRecordById(id)
  }
}