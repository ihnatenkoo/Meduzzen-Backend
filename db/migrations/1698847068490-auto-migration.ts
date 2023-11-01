import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1698847068490 implements MigrationInterface {
  name = 'AutoMigration1698847068490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "companies_members_users" ("companiesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_aeb6f7ef3ef0b0d725128276e6f" PRIMARY KEY ("companiesId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db887b0af813a8b1ec90efd78c" ON "companies_members_users" ("companiesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b9d92c57aa00cba2b1c7d0670" ON "companies_members_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "companies_members_users" ADD CONSTRAINT "FK_db887b0af813a8b1ec90efd78c0" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies_members_users" ADD CONSTRAINT "FK_3b9d92c57aa00cba2b1c7d06704" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "companies_members_users" DROP CONSTRAINT "FK_3b9d92c57aa00cba2b1c7d06704"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies_members_users" DROP CONSTRAINT "FK_db887b0af813a8b1ec90efd78c0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b9d92c57aa00cba2b1c7d0670"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db887b0af813a8b1ec90efd78c"`,
    );
    await queryRunner.query(`DROP TABLE "companies_members_users"`);
  }
}
