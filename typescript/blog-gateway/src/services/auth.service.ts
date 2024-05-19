import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AUTH_PACKAGE } from 'src/constants';
import {
  Auth as AuthMicro,
  LoginRequest,
  RegisterRequest,
} from 'src/micros/auth';
import { handleError } from 'src/utils';

@Injectable()
export class AuthService implements OnModuleInit {
  private authMicro: AuthMicro;

  constructor(@Inject(AUTH_PACKAGE) private authClient: ClientGrpc) {}

  onModuleInit() {
    this.authMicro = this.authClient.getService<AuthMicro>('Auth');
  }

  @handleError
  async login(payload: LoginRequest) {
    return await firstValueFrom(this.authMicro.login(payload));
  }

  @handleError
  async register(payload: RegisterRequest) {
    return await firstValueFrom(this.authMicro.register(payload));
  }
}
