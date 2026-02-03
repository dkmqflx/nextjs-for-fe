import { Injectable } from '@nestjs/common';

@Injectable() // 어디서든 인젝션을 받을 수 있어야 하므로 injectable 이라는 데코레이터 있음
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
