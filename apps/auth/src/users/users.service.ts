import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './models/user.entity';
import { Role } from './models/role.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
    });
    this.userRepository.create(user);
  }

  private async validateCreatedUsrDto(createUser: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUser.email });

      throw new UnauthorizedException('Email already exists');
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }
}
