import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigrate1698933717887 implements MigrationInterface {
    name = 'AutoMigrate1698933717887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_admin_in_companies_companies" ("usersId" integer NOT NULL, "companiesId" integer NOT NULL, CONSTRAINT "PK_1085f47d371af4dc6783e5aae07" PRIMARY KEY ("usersId", "companiesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_689bcce20ae0a1b19ca733b328" ON "users_admin_in_companies_companies" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd0d3493be32692f666cc956a3" ON "users_admin_in_companies_companies" ("companiesId") `);
        await queryRunner.query(`ALTER TABLE "users_admin_in_companies_companies" ADD CONSTRAINT "FK_689bcce20ae0a1b19ca733b3281" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_admin_in_companies_companies" ADD CONSTRAINT "FK_cd0d3493be32692f666cc956a37" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_admin_in_companies_companies" DROP CONSTRAINT "FK_cd0d3493be32692f666cc956a37"`);
        await queryRunner.query(`ALTER TABLE "users_admin_in_companies_companies" DROP CONSTRAINT "FK_689bcce20ae0a1b19ca733b3281"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd0d3493be32692f666cc956a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_689bcce20ae0a1b19ca733b328"`);
        await queryRunner.query(`DROP TABLE "users_admin_in_companies_companies"`);
    }

}
