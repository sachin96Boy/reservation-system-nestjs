import { AbstractRepository } from '@app/common';
import { UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
