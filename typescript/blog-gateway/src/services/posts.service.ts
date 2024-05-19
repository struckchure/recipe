import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { POSTS_PACKAGE } from 'src/constants';
import {
  CreateRequest,
  DeleteRequest,
  GetRequest,
  ListRequest,
  Post as PostMicro,
  UpdateRequest,
} from 'src/micros/posts';
import { handleError } from 'src/utils';

@Injectable()
export class PostsService implements OnModuleInit {
  private postMicro: PostMicro;

  constructor(@Inject(POSTS_PACKAGE) private postClient: ClientGrpc) {}

  onModuleInit() {
    this.postMicro = this.postClient.getService<PostMicro>('Post');
  }

  @handleError
  async list(payload: ListRequest) {
    return await firstValueFrom(this.postMicro.list(payload));
  }

  @handleError
  async create(payload: CreateRequest) {
    return await firstValueFrom(this.postMicro.create(payload));
  }

  @handleError
  async get(payload: GetRequest) {
    return await firstValueFrom(this.postMicro.get(payload));
  }

  @handleError
  async update(payload: UpdateRequest) {
    return await firstValueFrom(this.postMicro.update(payload));
  }

  @handleError
  async delete(payload: DeleteRequest) {
    return await firstValueFrom(this.postMicro.delete(payload));
  }
}
