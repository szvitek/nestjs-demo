import { Injectable } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../types/payload';
import { User } from '../types/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: Payload) {
    return this.userService.findByPayload(payload);
  }

  async login(user: User) {
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
      sub: user._id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
