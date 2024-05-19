import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AUTH_PACKAGE, POSTS_PACKAGE } from 'src/constants';
import { AuthController } from 'src/controllers/auth.controller';
import { PostsController } from 'src/controllers/posts.controller';
import { Encryption } from 'src/encryption';
import { AuthService } from 'src/services/auth.service';
import { PostsService } from 'src/services/posts.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: 'auth',
          protoPath: `${process.cwd()}/proto/auth.proto`,
        },
      },
      {
        name: POSTS_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: 'posts',
          protoPath: `${process.cwd()}/proto/posts.proto`,
        },
      },
    ]),
  ],
  controllers: [AuthController, PostsController],
  providers: [
    AuthService,
    PostsService,
    {
      provide: Encryption,
      useFactory() {
        return new Encryption('simple-key');
      },
    },
  ],
})
export class AppModule {}
