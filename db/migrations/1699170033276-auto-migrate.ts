import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigrate1699170033276 implements MigrationInterface {
    name = 'AutoMigrate1699170033276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quizzes_results" ("id" SERIAL NOT NULL, "correctAnswers" integer NOT NULL, "totalQuestions" integer NOT NULL, "ratio" double precision NOT NULL, "details" jsonb NOT NULL, "finalTime" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "company_id" integer, "quiz_id" integer, CONSTRAINT "PK_1fada9bc774eed4e425194ba57f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_d9ab8424bb28467e1dc9fd7755b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_e5849f962fc16d5cbccf6e6a5cf" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_afe527929b686952436b3304993" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_afe527929b686952436b3304993"`);
        await queryRunner.query(`ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_e5849f962fc16d5cbccf6e6a5cf"`);
        await queryRunner.query(`ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_d9ab8424bb28467e1dc9fd7755b"`);
        await queryRunner.query(`DROP TABLE "quizzes_results"`);
    }

}
