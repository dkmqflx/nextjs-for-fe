import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'post',
})
export class Post {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;
  // id: number; // 기본 키, 자동으로 증가하는 값

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false }) // text: 길이 상관 없이 긴 텍스트를 저장하는 데 사용
  content: string;

  // name을 달아주지 않으면 authorId로 자동으로 생성된다.
  // 보통 데이터 베이스 칼럼은 snake_case로 작성하는 것이 관례
  @Column({
    type: 'int',
    name: 'author_id',
    nullable: false,
  })
  authorId: number;
}
