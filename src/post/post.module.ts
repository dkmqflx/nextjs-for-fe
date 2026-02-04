import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { Post } from './post.entity';

// Post와 관련된 기능(컨트롤러, 서비스, 레포지토리 등)을 하나로 묶어주는 모듈
// NestJS는 이 모듈 정보를 보고 DI 컨테이너를 구성하고, 필요한 곳에 의존성을 주입해 준다.
@Module({
  // imports: [TypeOrmModule.forFeature([Post])], // 이 모듈에서 Post 엔티티용 TypeORM 리포지토리를 사용할 때 등록
  controllers: [PostController], // HTTP 요청을 받고 라우팅을 담당하는 컨트롤러 목록
  providers: [PostService, PostRepository], // DI 컨테이너에 등록할 서비스/레포지토리 등(주입 가능한 클래스) 목록
})
export class PostModule {}

/**
 * 왜 providers에 등록해야 하나?
 *
 * Nest 입장에서 보면:
 * “어떤 것들을 인스턴스로 만들어야 하지?”를 알아야 하고
 * “어떤 타입/토큰을 요청받으면 무엇을 줘야 하지?”를 매핑해야 합니다.
 *
 * providers: [PostService]라고 적는 순간:
 * Nest는 PostService를 컨테이너에 등록
 * 누가 constructor(private postService: PostService)라고 요청하면:
 * “아, 이 타입은 providers에 있으니까 내가 만들어서 넣어줘야겠네” 하고 인스턴스를 주입
 */
