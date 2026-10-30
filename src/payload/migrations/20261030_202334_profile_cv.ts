import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_profile_experience_employment" AS ENUM('full-time', 'contract');
  CREATE TABLE "profile_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"note" varchar,
  	"summary" varchar,
  	"highlights" varchar,
  	"work_id" integer
  );
  
  ALTER TABLE "profile_experience" ADD COLUMN "company_location" varchar;
  ALTER TABLE "profile_experience" ADD COLUMN "via" varchar;
  ALTER TABLE "profile_experience" ADD COLUMN "employment" "enum_profile_experience_employment" DEFAULT 'full-time';
  ALTER TABLE "profile_experience" ADD COLUMN "remote" boolean DEFAULT false;
  ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_projects_order_idx" ON "profile_projects" USING btree ("_order");
  CREATE INDEX "profile_projects_parent_id_idx" ON "profile_projects" USING btree ("_parent_id");
  CREATE INDEX "profile_projects_work_idx" ON "profile_projects" USING btree ("work_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_projects" CASCADE;
  ALTER TABLE "profile_experience" DROP COLUMN "company_location";
  ALTER TABLE "profile_experience" DROP COLUMN "via";
  ALTER TABLE "profile_experience" DROP COLUMN "employment";
  ALTER TABLE "profile_experience" DROP COLUMN "remote";
  DROP TYPE "public"."enum_profile_experience_employment";`)
}
