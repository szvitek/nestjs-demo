import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  testAuth() {
    return { auth: 'works' };
  }

  @Post('login')
  async login(@Body() userDTO: any) {
    const user = await this.userService.findByLogin(userDTO);
    const { token } = await this.authService.login(user);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: any) {
    const user = await this.userService.create(userDTO);
    const { token } = await this.authService.login(user);
    return { user, token };
  }
}
