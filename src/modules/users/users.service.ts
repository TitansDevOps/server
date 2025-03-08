import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { messages } from 'src/messages/messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const id: number = updateUserDto.id;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new BadRequestException(messages.userNotFound);
      }

      if (user.email != updateUserDto.email) {
        const emailUser = await this.findOneByEmail(updateUserDto.email);
        if (emailUser) {
          throw new BadRequestException(messages.userAlreadyExist);
        } else {
          user.email = updateUserDto.email;
        }
      }

      if (updateUserDto.address) {
        user.address = updateUserDto.address;
      }

      if (updateUserDto.isActive || !updateUserDto.isActive) {
        user.isActive = updateUserDto.isActive;
      }

      if (updateUserDto.phone) {
        user.phone = updateUserDto.phone;
      }

      if (updateUserDto.fullName) {
        user.fullName = updateUserDto.fullName;
      }

      if (updateUserDto.resetPassword === true && updateUserDto.password) {
        user.password = updateUserDto.password;
      }

      return this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(messages.errorUpdateUser);
    }
  }
}
