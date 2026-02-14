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

// TODO: 전역 ValidationPipe 설정 방법 참고
/**
 * 1. 왜 @UsePipes 없이도 ValidationPipe가 동작하나? - 파이프를 거는 위치가 다를 뿐입니다.
 *
 * 방식 A: 핸들러에 파이프 적용
 * @UsePipes(new ValidationPipe()) → 이 핸들러로 들어오는 요청에 ValidationPipe 적용.
 *
 * 방식 B: 파라미터에 파이프 적용 (지금 프로젝트 방식)
 * @Body(ValidationPipe) createPostDto → 이 파라미터에만 ValidationPipe 적용.
 * Nest는 @Body(), @Param() 등에 두 번째 인자로 파이프 클래스를 넘기면, 그 인자에 대해서만 그 파이프를 실행합니다.
 * 그래서 “해당 핸들러에 @UsePipes를 안 써도”, @Body(ValidationPipe) 때문에 그 body에는 ValidationPipe가 적용되는 것입니다.
 * 정리하면, @UsePipes를 안 써도 되는 이유는 @Body(ValidationPipe) 로 이미 그 파라미터에 ValidationPipe를 붙였기 때문입니다.
 *
 * 2. 더 권장되는 방식
 * 전역 등록이 가장 권장되는 편입니다.
 * 전역 한 번만 설정하면 모든 라우트에 적용됨.
 * DTO에 class-validator만 붙여두면 되고, 새 엔드포인트를 만들어도 검증을 빼먹을 일이 적음.
 * Nest 공식 문서에서도 전역 ValidationPipe를 먼저 보여주는 경우가 많음.
 * 
 * 즉, 아래처럼 전역으로 ValidationPipe를 등록하는 게 가장 권장되는 방식입니다.
 * 
 * https://www.mingo.team/class-materials/42
 *   // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 있으면 요청 자체를 막음
      transform: true, // 요청 데이터를 DTO의 타입으로 자동 변환
    }),
  );

  이렇게 하면, 위에서도 @UsePipes(ValidationPipe) 안 써도 되고, @Body(ValidationPipe) 안 써도 됩니다.
 */
