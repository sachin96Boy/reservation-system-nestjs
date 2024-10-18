import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategie extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.validateUser(username, password);
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
