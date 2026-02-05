import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!, 10) || 5432,
      username: process.env.DB_USERNAME || 'test',
      password: process.env.DB_PASSWORD || 'test',
      database: process.env.DB_DATABASE || 'inflearn',

      autoLoadEntities: true, // 모든 엔티티를 자동으로 로드
      synchronize: true, // nestjs 앱이 시작될 때 데이터베이스 스키마를 동기화, 개발 환경에서만 사용
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
