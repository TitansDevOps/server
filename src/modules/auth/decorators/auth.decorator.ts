import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@modules/common/enums/rol.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
