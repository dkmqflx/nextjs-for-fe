import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

// DB 인덱스란 데이터베이스에서 특정 데이터에 접근을 빨리 하거나, 어떤 데이터베이스 테이블에 특정 조건을 넣을 때 사용된다
@Entity()
// IDX_POST_TITLE: title 컬럼에 대한 인덱스. 제목으로 검색하거나 정렬할 때 더 빨리 찾기 위한 “책갈피” 역할.
@Index('IDX_POST_TITLE', ['title']) // title에 대한 인덱스 이름 저장
// IDX_POST_AUTHOR_ID: authorId 컬럼에 대한 인덱스. 특정 작성자의 글 목록을 조회하거나 작성자 기준 정렬을 빠르게 하기 위한 책갈피.
@Index('IDX_POST_AUTHOR_ID', ['authorId'])
// IDX_POST_TITLE_AUTHOR_ID: title + authorId를 묶은 복합 유니크 인덱스.
// 1) 같은 작성자(authorId)가 같은 제목(title)으로 두 번 글을 쓰지 못하게(조합이 항상 고유)
// 2) “이 작성자가 쓴 이 제목의 글”을 찾을 때 두 컬럼 조합으로 빠르게 조회 가능.
@Index('IDX_POST_TITLE_AUTHOR_ID', ['title', 'authorId'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({
    type: 'int',
    name: 'author_id',
    nullable: false,
  })
  authorId: number;
}
