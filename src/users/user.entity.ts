import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string; //argon2 등으로 해싱된 비밀번호 저장하는데, 해싱된 값이 255인것 사전에 확인했다

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshToken?: string | null;
  /**
   * 리프레시토큰을 DB에 저장하는 이유
   * 액세스토큰은 짧은 수명을 가지므로, 만료되면 사용자는 다시 로그인을 해야 합니다.
   * 리프레시토큰은 더 긴 수명을 가지며, 액세스토큰이 만료되었을 때 새로운 액세스토큰을 발급받기 위해 사용됩니다.
   * 리프레시토큰을 DB에 저장함으로써, 서버는 해당 토큰이 유효한지 확인할 수 있습니다.
   * 만약 리프레시토큰이 탈취되더라도, 서버에서 이를 무효화할 수 있어 보안성을 높일 수 있습니다.
   */
}

// TODO: 소셜 로그인 구현하기 - (ex. 카카오, 네이버, 구글 등)
