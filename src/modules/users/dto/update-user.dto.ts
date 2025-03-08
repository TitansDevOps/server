import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;

  resetPassword: boolean = false;

  async updateDTO(user: User, resetPassword: boolean) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.address = user.address;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.role = user.role;
    this.password = user.password;
    this.resetPassword = resetPassword;
    return this;
  }
}
