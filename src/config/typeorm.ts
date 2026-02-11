import { registerAs } from '@nestjs/config';
// nestjs에 다양한 config를 심을 수 있다
// 데이터베이스 이외에도 redis 같은 캐시나
// S3 같은 외부 스토리지 설정도 여기에 담을 수 있다
// 하지만 이런 설정들이 충돌하면 안되고, 사용하기에는 편해야하므로 config를 미리 등록할 수 있는 registerAs 함수 제공
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST || 'localhost'}`,
  port: parseInt(`${process.env.DB_PORT || '5432'}`, 10),
  username: `${process.env.DB_USERNAME || 'test'}`,
  password: `${process.env.DB_PASSWORD || 'test'}`,
  database: `${process.env.DB_DATABASE || 'inflearn'}`,
  entities: ['dist/**/**/*.entity{.ts,.js}'], // TypeORM이 엔티티 클래스 파일을 어디서 찾을지 지정합니다.
  migrations: ['dist/migrations/*{.ts,.js}'], // TypeORM이 마이그레이션 파일을 어디서 찾을지 지정합니다.
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config); // config를 미리 등록하는 함수
export const connectionSource = new DataSource(config as DataSourceOptions);

/**
 * ✅ autoLoadEntities: true를 사용하는 경우, entities는 NestJS 애플리케이션 내에서 실행할 때는 생략 가능합니다.
 * ❗ 하지만 typeorm CLI나 DataSource를 사용하는 마이그레이션 실행 시에는 entities가 필수입니다.
 *
 * 이유 설명
 * autoLoadEntities: true는 NestJS 런타임 환경에서만 작동합니다.
 * TypeOrmModule.forFeature()로 등록된 엔티티들을 자동으로 감지합니다.
 * 이는 NestJS의 DI 컨테이너를 활용하기 때문에 NestJS 앱 실행 시에만 적용됩니다.
 *
 * 반면, typeorm CLI나 DataSource를 직접 사용할 때는 Nest 컨텍스트가 없기 때문에,
 * const connectionSource = new DataSource(config);
 * 이 config에 entities 배열이 명시적으로 있어야 마이그레이션이 정상 작동합니다.
 *
 * 결론적으로
 * autoLoadEntities: true → NestJS 앱 실행 시 유용
 * entities: ['dist ....']
 * → 마이그레이션 및 CLI 명령 실행 시 필수
 *
 * 따라서 autoLoadEntities: true와
 * entities: [...]를 함께 사용하는 것이 실전에서는 안전한 조합입니다.
 * 특히 저희처럼 typeorm 마이그레이션을 사용하고 있다면 entities를 생략하지 않아야 정상동작을 합니다.
 */
