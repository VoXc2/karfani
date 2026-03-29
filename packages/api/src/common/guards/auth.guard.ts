import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException('التوكن مطلوب');
    try {
      request.user = jwt.verify(authHeader.split(' ')[1], this.configService.get('JWT_SECRET')!);
      return true;
    } catch {
      throw new UnauthorizedException('توكن غير صالح');
    }
  }
}
