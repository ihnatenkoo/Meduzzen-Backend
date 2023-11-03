import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1698999433870 implements MigrationInterface {
    name = 'Auto1698999433870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "answers" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "answers" jsonb array NOT NULL DEFAULT '{}'`);
    }

}
