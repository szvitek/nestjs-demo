import { Injectable } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: any) {
    return this.userService.findByPayload(payload);
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      seller: user.seller,
      sub: user._id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
