import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { jwtConstants } from '@modules/auth/constants/jwt.constant';
import { IS_PUBLIC_KEY } from '@modules/auth/decorators/public.decorator';

import { messages } from 'src/messages/messages';
import { BEARER_TOKEN } from '@modules/admin/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // permite extraer el token de la url 
    // const token = this.extractTokenFromHeader(request) || this.extractTokenFromQuery(request);

    if (!token) {
      throw new UnauthorizedException(messages.tokenNoProvide);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request.user = payload;
      if (!payload.role) {
        throw new UnauthorizedException(messages.userRoleMissing);
      }
    } catch (error) {
      throw new UnauthorizedException(messages.invalidToken);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === BEARER_TOKEN ? token : undefined;
  }

  // permite extraer el token de la url -- comentado por seguridad
  // private extractTokenFromQuery(request: Request): string | undefined {
  //   return request.query.token as string;
  // }
}
