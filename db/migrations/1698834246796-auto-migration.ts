import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1698834246796 implements MigrationInterface {
    name = 'AutoMigration1698834246796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP COLUMN "created_at"`);
    }

}
