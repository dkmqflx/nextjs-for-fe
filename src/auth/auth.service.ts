import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as argon2 from 'argon2';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService, // 환경변수 접근용
  ) {}

  // signUp
  async signUp(data: SignUpDto): Promise<any> {
    // user exists?
    const existUser = await this.usersService.findByUsername(data.username);
    if (existUser) {
      throw new BadRequestException(
        `${data.username}으로 이미 가입된 계정이 있습니다.`,
      );
    }

    // password encryption
    const hashedPassword = await this.hashFn(data.password);
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    // user대신 token을 반환
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  // signIn
  async signIn(data: SignInDto): Promise<any> {
    const user = await this.usersService.findByUsername(data.username);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordMatched = await argon2.verify(user.password, data.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signOut(userId: string) {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  // 엑세스 토큰을 리프레시 토큰을 활용해서 재발급 받을 수 있다. -> 완전히 새로운 토큰 세트를 발급
  async refreshAllTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('refresh token이 존재하지 않습니다.');
    }

    const isRefreshTokenMatched = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatched) {
      throw new ForbiddenException('refresh token이 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async hashFn(data: string): Promise<string> {
    return argon2.hash(data);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashFn(refreshToken);
    // refreshToken 한번 더 암호화 하는 이유는 DB에 저장할 때 보안을 위해서

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async getTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      // signAsync -> 새로운 JWT 토큰 생성
      this.jwtService.signAsync(
        {
          sub: user.id, // subject, 토큰의 주체
          username: user.username, // 나중에 컨트롤러 같은 데서 편하게 쓰려고
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'), // 시크릿키
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
