import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '@modules/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { messages } from 'src/messages/messages';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService extends BaseService<User, UserDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, UserDto);
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'fullName', 'email', 'password', 'role'],
    });
  }

  // async update(updateUserDto: UpdateUserDto) {
  //   const id: number = updateUserDto.id;
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(messages.userNotFound);
  //   }

  //   if (user.email != updateUserDto.email) {
  //     const emailUser = await this.findOneByEmail(updateUserDto.email);
  //     if (emailUser) {
  //       throw new BadRequestException(messages.userAlreadyExist);
  //     } else {
  //       user.email = updateUserDto.email;
  //     }
  //   }

  //   if (updateUserDto.address) {
  //     user.address = updateUserDto.address;
  //   }

  //   if (updateUserDto.isActive || !updateUserDto.isActive) {
  //     user.isActive = updateUserDto.isActive;
  //   }

  //   if (updateUserDto.phone) {
  //     user.phone = updateUserDto.phone;
  //   }

  //   if (updateUserDto.fullName) {
  //     user.fullName = updateUserDto.fullName;
  //   }

  //   if (updateUserDto.resetPassword === true && updateUserDto.password) {
  //     user.password = updateUserDto.password;
  //   }

  //   const newUser = await this.userRepository.save(user);
  //   return {
  //     id: newUser.id,
  //     fullName: newUser.fullName,
  //     email: newUser.email,
  //     role: newUser.role,
  //     createdAt: newUser.createdAt,
  //     address: newUser.address,
  //     phone: newUser.phone,
  //   };
  // }
}
