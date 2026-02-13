// src/auth/strategies/access-token.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * 스트래터지는 기본적으로 유저의 인증을 처리하고, 성공하면 유저 정보를 반환합니다.
 * 리턴하는 페이로드에 아래 타입을 사용합니다.
 */
type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token', // 스트래터지 이름
) {
  constructor(private configService: ConfigService) {
    // super 호출 시, PassportStrategy의 constructor를 호출하게 된다
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 요청 헤더에서 JWT 추출 -> Bearer xxxxx에서 xxxxx만 추출하는 로직을 Passport가 대신 수행하는 것입니다.
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'), // 이렇게만 해도 JWT의 유효성 검증이 자동으로 수행됩니다.
      /**
       * JWT는 Header.Payload.Signature로 구성되는데,
       * Passport 엔진은 전달받은 토큰의 Header와 Payload를 서버의 Secret Key로 직접 다시 암호화해 봅니다.
       * 직접 만든 결과값 == 토큰에 적힌 Signature 라면? → "변조되지 않은 안전한 토큰이군!" (통과)
       * 다르다면? → "누군가 조작했거나 잘못된 키다!" (401 Unauthorized 에러 자동 발생)
       */
    });
  }

  // validate 메서드는 JWT가 유효할 때 호출됩니다.
  validate(payload: JwtPayload) {
    return payload;
  }
}
