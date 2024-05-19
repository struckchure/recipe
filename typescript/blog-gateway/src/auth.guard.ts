import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Encryption } from 'src/encryption';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly encryption: Encryption) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('authorization header is required');
    }

    try {
      const payload = await this.encryption.decrypt(token);
      if (!payload) {
        throw new UnauthorizedException();
      }

      request['userId'] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
