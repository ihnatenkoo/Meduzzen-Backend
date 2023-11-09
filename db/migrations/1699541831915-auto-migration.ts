import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1699541831915 implements MigrationInterface {
  name = 'AutoMigration1699541831915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "join_requests" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" integer, "company_id" integer, CONSTRAINT "PK_3584a09620923a5aaf7de782f0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('system', 'company')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('read', 'unread')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'unread', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "company_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "answers" text array NOT NULL DEFAULT '{}', "correctAnswerIndex" integer NOT NULL, "quizId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "frequency" integer NOT NULL, "companyId" integer, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes_results" ("id" SERIAL NOT NULL, "correctAnswers" integer NOT NULL, "totalQuestions" integer NOT NULL, "ratio" double precision NOT NULL, "details" jsonb NOT NULL, "finalTime" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "company_id" integer, "quiz_id" integer, CONSTRAINT "PK_1fada9bc774eed4e425194ba57f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "bio" character varying, "avatar" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "isPublic" boolean NOT NULL DEFAULT true, "owner_id" integer, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitations" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" integer, "recipient_id" integer, "company_id" integer, CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_admin_in_companies_companies" ("usersId" integer NOT NULL, "companiesId" integer NOT NULL, CONSTRAINT "PK_1085f47d371af4dc6783e5aae07" PRIMARY KEY ("usersId", "companiesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_689bcce20ae0a1b19ca733b328" ON "users_admin_in_companies_companies" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd0d3493be32692f666cc956a3" ON "users_admin_in_companies_companies" ("companiesId") `,
    );
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
      `ALTER TABLE "join_requests" ADD CONSTRAINT "FK_6680f18bdeae5e901476481f01c" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "join_requests" ADD CONSTRAINT "FK_b15f5ebf9e6361128abe77e7280" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_c642fb845de2edcae46635863ab" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_5b10313e300a524a79e4216d20f" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_d9ab8424bb28467e1dc9fd7755b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_e5849f962fc16d5cbccf6e6a5cf" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" ADD CONSTRAINT "FK_afe527929b686952436b3304993" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_9f63a5f4c5895a7be4d3f18ebe7" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_bce12d652fbe682d912eda0bec8" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_53407578b13649da4cac07455ad" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_admin_in_companies_companies" ADD CONSTRAINT "FK_689bcce20ae0a1b19ca733b3281" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_admin_in_companies_companies" ADD CONSTRAINT "FK_cd0d3493be32692f666cc956a37" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "users_admin_in_companies_companies" DROP CONSTRAINT "FK_cd0d3493be32692f666cc956a37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_admin_in_companies_companies" DROP CONSTRAINT "FK_689bcce20ae0a1b19ca733b3281"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_53407578b13649da4cac07455ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_bce12d652fbe682d912eda0bec8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_9f63a5f4c5895a7be4d3f18ebe7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_afe527929b686952436b3304993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_e5849f962fc16d5cbccf6e6a5cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes_results" DROP CONSTRAINT "FK_d9ab8424bb28467e1dc9fd7755b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_5b10313e300a524a79e4216d20f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_c642fb845de2edcae46635863ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "join_requests" DROP CONSTRAINT "FK_b15f5ebf9e6361128abe77e7280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "join_requests" DROP CONSTRAINT "FK_6680f18bdeae5e901476481f01c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b9d92c57aa00cba2b1c7d0670"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db887b0af813a8b1ec90efd78c"`,
    );
    await queryRunner.query(`DROP TABLE "companies_members_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd0d3493be32692f666cc956a3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_689bcce20ae0a1b19ca733b328"`,
    );
    await queryRunner.query(`DROP TABLE "users_admin_in_companies_companies"`);
    await queryRunner.query(`DROP TABLE "invitations"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "quizzes_results"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "join_requests"`);
  }
}
