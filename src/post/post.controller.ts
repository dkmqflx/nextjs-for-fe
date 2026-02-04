import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe, // DTO에 정의된 유효성 검사 데코레이터를 기준으로 요청 body를 검증하고, 실패 시 자동으로 예외를 던지는 파이프
  ParseIntPipe, // 문자열로 들어온 id를 number로 변환하고, 숫자가 아니면 자동으로 예외를 던지는 파이프
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// /post로 시작하는 모든 요청을 처리하는 컨트롤러
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // /posts로 들어오는 GET 요청을 처리하는 메서드
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  // /posts로 들어오는 POST 요청을 처리하는 메서드
  @Post()
  create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
