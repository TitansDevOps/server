import { BaseDto } from '@modules/common/dto/base.dto';
import { User } from '@modules/users/entities/user.entity';

export class UserDto extends BaseDto<User> {
  constructor(user: User) {
    super(user);
  }

  toList() {
    const { id, fullName, email, role, createdAt, address, phone } =
      this.entity;

    return {
      id,
      fullName,
      email,
      role,
      createdAt,
      address,
      phone,
    };
  }

  toJson() {
    const { id, fullName, email, role, createdAt, address, phone, isActive } =
      this.entity;

    return {
      id,
      fullName,
      email,
      role,
      createdAt,
      address,
      phone,
      isActive,
    };
  }
}
