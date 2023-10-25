import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1698251664432 implements MigrationInterface {
  name = 'CreateUser1698251664432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "hashPassword" character varying NOT NULL, "bio" character varying NOT NULL, "avatar" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
