import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {}

// 유저를 생성하는 로직은 auth 모듈에서 담당하도록 할 것
