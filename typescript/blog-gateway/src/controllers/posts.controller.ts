import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';

import { CreateRequest, ListRequest, UpdateRequest } from 'src/micros/posts';
import { PostsService } from 'src/services/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async list(@Query() payload: ListRequest) {
    return await this.postsService.list(payload);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() payload: CreateRequest) {
    return await this.postsService.create(payload);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.postsService.get({ id });
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() payload: UpdateRequest) {
    payload.id = id;

    return await this.postsService.update(payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    await this.postsService.delete({ id });
  }
}
