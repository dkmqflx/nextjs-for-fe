import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  // TypeORM이 Post 엔티티용 Repository<Post> 인스턴스를 생성해 두고,
  // @InjectRepository(Post)를 통해 이 생성자에 주입해 주므로 this.postRepository로 DB CRUD 작업을 수행할 수 있다.
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: number): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id } });
    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    console.log('createPostDto:', createPostDto);
    try {
      const post = this.postRepository.create(createPostDto);
      return await this.postRepository.save(post);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          '해당 제목과 작성자를 가진 게시글이 이미 존재합니다.',
        );
      }
      /**
       * '23505'는 PostgreSQL의 UNIQUE 제약 조건 위반 에러코드입니다.
       * 엔티티에 제목(title)과 작성자(author) 조합에 대한 UNIQUE 제약이 설정되어 있을 때 발생합니다.
       * 즉, 같은 제목과 작성자를 가진 게시글을 중복으로 생성하려고 할 때 데이터베이스가 이를 막고 이 에러 코드를 반환하는 것입니다.
       */
      throw error;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const result = await this.postRepository.update(id, updatePostDto);

    // TypeORM의 update/delete 작업으로 영향을 받은 행(row)의 개수입니다.
    // 0이면 조건에 맞는 데이터가 없다는 의미
    if (result.affected === 0) {
      throw new NotFoundException(`${id}에 해당하는 Post를 찾을 수 없습니다.`);
    }

    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`${id}에 해당하는 Post를 찾을 수 없습니다.`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${id}에 해당하는 Post를 찾을 수 없습니다.`);
    }
  }
}
