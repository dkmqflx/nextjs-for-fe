import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1770799874032 implements MigrationInterface {
  name = 'InitialMigration1770799874032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "author_id" integer NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_POST_TITLE_AUTHOR_ID" ON "post" ("title", "author_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_POST_AUTHOR_ID" ON "post" ("author_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_POST_TITLE" ON "post" ("title") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_POST_TITLE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_POST_AUTHOR_ID"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_POST_TITLE_AUTHOR_ID"`);
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
