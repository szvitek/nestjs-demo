import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { User } from '../utils/user.decorator';
import { SellerGuard } from '../guards/seller.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // todo: delete later, this is just for playing around
  @Get()
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async findAll(@User() user: any) {
    // to access this method req should have a valid token, and the user should be a seller
    console.log(user); // this user is populated by the validate method in jwt strategy
    return await this.userService.findAll();
  }

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const { token } = await this.authService.login(user);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const { token } = await this.authService.login(user);
    return { user, token };
  }
}
