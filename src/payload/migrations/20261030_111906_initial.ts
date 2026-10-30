import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_work_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_writing_language" AS ENUM('tsx', 'ts', 'js', 'css', 'html', 'vue', 'json', 'bash', 'md');
  CREATE TYPE "public"."enum_writing_format" AS ENUM('article', 'note', 'snippet');
  CREATE TYPE "public"."enum_writing_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__writing_v_version_language" AS ENUM('tsx', 'ts', 'js', 'css', 'html', 'vue', 'json', 'bash', 'md');
  CREATE TYPE "public"."enum__writing_v_version_format" AS ENUM('article', 'note', 'snippet');
  CREATE TYPE "public"."enum__writing_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_craft_demo" AS ENUM('halftone-shape', 'page-transition');
  CREATE TYPE "public"."enum_craft_code_language" AS ENUM('tsx', 'ts', 'js', 'css', 'html', 'vue', 'json', 'bash', 'md');
  CREATE TYPE "public"."enum_craft_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__craft_v_version_demo" AS ENUM('halftone-shape', 'page-transition');
  CREATE TYPE "public"."enum__craft_v_version_code_language" AS ENUM('tsx', 'ts', 'js', 'css', 'html', 'vue', 'json', 'bash', 'md');
  CREATE TYPE "public"."enum__craft_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_site_settings_social_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "work_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "work" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"cover_media_id" integer,
  	"cover_poster_id" integer,
  	"content" jsonb,
  	"retrospective" varchar,
  	"recommendation_id" integer,
  	"role" varchar,
  	"client" varchar,
  	"team" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"live_url" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"confidential" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_work_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "work_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "work_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "_work_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_work_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_media_id" integer,
  	"version_cover_poster_id" integer,
  	"version_content" jsonb,
  	"version_retrospective" varchar,
  	"version_recommendation_id" integer,
  	"version_role" varchar,
  	"version_client" varchar,
  	"version_team" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_live_url" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_confidential" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__work_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_work_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_work_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "writing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"why" varchar,
  	"language" "enum_writing_language" DEFAULT 'tsx',
  	"source_url" varchar,
  	"code" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"format" "enum_writing_format" DEFAULT 'article',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"related_craft_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_writing_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "writing_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"work_id" integer
  );
  
  CREATE TABLE "_writing_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_why" varchar,
  	"version_language" "enum__writing_v_version_language" DEFAULT 'tsx',
  	"version_source_url" varchar,
  	"version_code" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_format" "enum__writing_v_version_format" DEFAULT 'article',
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_related_craft_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__writing_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_writing_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"work_id" integer
  );
  
  CREATE TABLE "craft" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"demo" "enum_craft_demo",
  	"fallback_media_id" integer,
  	"code_language" "enum_craft_code_language" DEFAULT 'tsx',
  	"code" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_craft_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "craft_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "_craft_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_demo" "enum__craft_v_version_demo",
  	"version_fallback_media_id" integer,
  	"version_code_language" "enum__craft_v_version_code_language" DEFAULT 'tsx',
  	"version_code" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__craft_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_craft_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  
  CREATE TABLE "recommendations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"linkedin_url" varchar,
  	"role" varchar,
  	"company" varchar,
  	"relationship" varchar,
  	"date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"related_work_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"poster_id" integer,
  	"caption" jsonb,
  	"prefix" varchar,
  	"_objectkey" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"writing_id" integer,
  	"work_id" integer,
  	"craft_id" integer
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"work_id" integer,
  	"writing_id" integer,
  	"craft_id" integer,
  	"recommendations_id" integer,
  	"topics_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"redirects_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "profile_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"company" varchar NOT NULL,
  	"company_url" varchar,
  	"role" varchar NOT NULL,
  	"location" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"summary" varchar,
  	"highlights" varchar,
  	"work_id" integer
  );
  
  CREATE TABLE "profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "profile_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"school" varchar NOT NULL,
  	"degree" varchar,
  	"start_year" numeric,
  	"end_year" numeric
  );
  
  CREATE TABLE "profile_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"issuer" varchar
  );
  
  CREATE TABLE "profile_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" varchar NOT NULL,
  	"level" varchar
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"availability" varchar,
  	"location" varchar,
  	"timezone" varchar DEFAULT 'Europe/Madrid',
  	"summary" varchar NOT NULL,
  	"cv_file_id" integer,
  	"available" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "profile_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_site_settings_social_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"writing_id" integer,
  	"work_id" integer,
  	"craft_id" integer
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"writing_id" integer,
  	"work_id" integer,
  	"craft_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"copyright" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"writing_id" integer,
  	"work_id" integer,
  	"craft_id" integer
  );
  
  ALTER TABLE "work_metrics" ADD CONSTRAINT "work_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_cover_poster_id_media_id_fk" FOREIGN KEY ("cover_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_texts" ADD CONSTRAINT "work_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_rels" ADD CONSTRAINT "work_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_rels" ADD CONSTRAINT "work_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_version_metrics" ADD CONSTRAINT "_work_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_parent_id_work_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_cover_media_id_media_id_fk" FOREIGN KEY ("version_cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_cover_poster_id_media_id_fk" FOREIGN KEY ("version_cover_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_recommendation_id_recommendations_id_fk" FOREIGN KEY ("version_recommendation_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v_texts" ADD CONSTRAINT "_work_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_rels" ADD CONSTRAINT "_work_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_rels" ADD CONSTRAINT "_work_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing" ADD CONSTRAINT "writing_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writing" ADD CONSTRAINT "writing_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writing" ADD CONSTRAINT "writing_related_craft_id_craft_id_fk" FOREIGN KEY ("related_craft_id") REFERENCES "public"."craft"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "writing_rels" ADD CONSTRAINT "writing_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing_rels" ADD CONSTRAINT "writing_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing_rels" ADD CONSTRAINT "writing_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_parent_id_writing_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writing"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_version_related_craft_id_craft_id_fk" FOREIGN KEY ("version_related_craft_id") REFERENCES "public"."craft"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v_rels" ADD CONSTRAINT "_writing_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_writing_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_writing_v_rels" ADD CONSTRAINT "_writing_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_writing_v_rels" ADD CONSTRAINT "_writing_v_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "craft" ADD CONSTRAINT "craft_fallback_media_id_media_id_fk" FOREIGN KEY ("fallback_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "craft" ADD CONSTRAINT "craft_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "craft_rels" ADD CONSTRAINT "craft_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "craft_rels" ADD CONSTRAINT "craft_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_craft_v" ADD CONSTRAINT "_craft_v_parent_id_craft_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."craft"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_craft_v" ADD CONSTRAINT "_craft_v_version_fallback_media_id_media_id_fk" FOREIGN KEY ("version_fallback_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_craft_v" ADD CONSTRAINT "_craft_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_craft_v_rels" ADD CONSTRAINT "_craft_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_craft_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_craft_v_rels" ADD CONSTRAINT "_craft_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_related_work_id_work_id_fk" FOREIGN KEY ("related_work_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_craft_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_craft_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recommendations_fk" FOREIGN KEY ("recommendations_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_experience" ADD CONSTRAINT "profile_experience_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_experience" ADD CONSTRAINT "profile_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_education" ADD CONSTRAINT "profile_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_certifications" ADD CONSTRAINT "profile_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_cv_file_id_documents_id_fk" FOREIGN KEY ("cv_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_texts" ADD CONSTRAINT "profile_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_craft_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_craft_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_craft_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."craft"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "work_metrics_order_idx" ON "work_metrics" USING btree ("_order");
  CREATE INDEX "work_metrics_parent_id_idx" ON "work_metrics" USING btree ("_parent_id");
  CREATE INDEX "work_cover_cover_media_idx" ON "work" USING btree ("cover_media_id");
  CREATE INDEX "work_cover_cover_poster_idx" ON "work" USING btree ("cover_poster_id");
  CREATE INDEX "work_recommendation_idx" ON "work" USING btree ("recommendation_id");
  CREATE INDEX "work_meta_meta_image_idx" ON "work" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "work_slug_idx" ON "work" USING btree ("slug");
  CREATE INDEX "work_updated_at_idx" ON "work" USING btree ("updated_at");
  CREATE INDEX "work_created_at_idx" ON "work" USING btree ("created_at");
  CREATE INDEX "work__status_idx" ON "work" USING btree ("_status");
  CREATE INDEX "work_texts_order_parent" ON "work_texts" USING btree ("order","parent_id");
  CREATE INDEX "work_rels_order_idx" ON "work_rels" USING btree ("order");
  CREATE INDEX "work_rels_parent_idx" ON "work_rels" USING btree ("parent_id");
  CREATE INDEX "work_rels_path_idx" ON "work_rels" USING btree ("path");
  CREATE INDEX "work_rels_topics_id_idx" ON "work_rels" USING btree ("topics_id");
  CREATE INDEX "_work_v_version_metrics_order_idx" ON "_work_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_work_v_version_metrics_parent_id_idx" ON "_work_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_work_v_parent_idx" ON "_work_v" USING btree ("parent_id");
  CREATE INDEX "_work_v_version_cover_version_cover_media_idx" ON "_work_v" USING btree ("version_cover_media_id");
  CREATE INDEX "_work_v_version_cover_version_cover_poster_idx" ON "_work_v" USING btree ("version_cover_poster_id");
  CREATE INDEX "_work_v_version_version_recommendation_idx" ON "_work_v" USING btree ("version_recommendation_id");
  CREATE INDEX "_work_v_version_meta_version_meta_image_idx" ON "_work_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_work_v_version_version_slug_idx" ON "_work_v" USING btree ("version_slug");
  CREATE INDEX "_work_v_version_version_updated_at_idx" ON "_work_v" USING btree ("version_updated_at");
  CREATE INDEX "_work_v_version_version_created_at_idx" ON "_work_v" USING btree ("version_created_at");
  CREATE INDEX "_work_v_version_version__status_idx" ON "_work_v" USING btree ("version__status");
  CREATE INDEX "_work_v_created_at_idx" ON "_work_v" USING btree ("created_at");
  CREATE INDEX "_work_v_updated_at_idx" ON "_work_v" USING btree ("updated_at");
  CREATE INDEX "_work_v_latest_idx" ON "_work_v" USING btree ("latest");
  CREATE INDEX "_work_v_autosave_idx" ON "_work_v" USING btree ("autosave");
  CREATE INDEX "_work_v_texts_order_parent" ON "_work_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_work_v_rels_order_idx" ON "_work_v_rels" USING btree ("order");
  CREATE INDEX "_work_v_rels_parent_idx" ON "_work_v_rels" USING btree ("parent_id");
  CREATE INDEX "_work_v_rels_path_idx" ON "_work_v_rels" USING btree ("path");
  CREATE INDEX "_work_v_rels_topics_id_idx" ON "_work_v_rels" USING btree ("topics_id");
  CREATE INDEX "writing_cover_idx" ON "writing" USING btree ("cover_id");
  CREATE INDEX "writing_meta_meta_image_idx" ON "writing" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "writing_slug_idx" ON "writing" USING btree ("slug");
  CREATE INDEX "writing_related_craft_idx" ON "writing" USING btree ("related_craft_id");
  CREATE INDEX "writing_updated_at_idx" ON "writing" USING btree ("updated_at");
  CREATE INDEX "writing_created_at_idx" ON "writing" USING btree ("created_at");
  CREATE INDEX "writing__status_idx" ON "writing" USING btree ("_status");
  CREATE INDEX "writing_rels_order_idx" ON "writing_rels" USING btree ("order");
  CREATE INDEX "writing_rels_parent_idx" ON "writing_rels" USING btree ("parent_id");
  CREATE INDEX "writing_rels_path_idx" ON "writing_rels" USING btree ("path");
  CREATE INDEX "writing_rels_topics_id_idx" ON "writing_rels" USING btree ("topics_id");
  CREATE INDEX "writing_rels_work_id_idx" ON "writing_rels" USING btree ("work_id");
  CREATE INDEX "_writing_v_parent_idx" ON "_writing_v" USING btree ("parent_id");
  CREATE INDEX "_writing_v_version_version_cover_idx" ON "_writing_v" USING btree ("version_cover_id");
  CREATE INDEX "_writing_v_version_meta_version_meta_image_idx" ON "_writing_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_writing_v_version_version_slug_idx" ON "_writing_v" USING btree ("version_slug");
  CREATE INDEX "_writing_v_version_version_related_craft_idx" ON "_writing_v" USING btree ("version_related_craft_id");
  CREATE INDEX "_writing_v_version_version_updated_at_idx" ON "_writing_v" USING btree ("version_updated_at");
  CREATE INDEX "_writing_v_version_version_created_at_idx" ON "_writing_v" USING btree ("version_created_at");
  CREATE INDEX "_writing_v_version_version__status_idx" ON "_writing_v" USING btree ("version__status");
  CREATE INDEX "_writing_v_created_at_idx" ON "_writing_v" USING btree ("created_at");
  CREATE INDEX "_writing_v_updated_at_idx" ON "_writing_v" USING btree ("updated_at");
  CREATE INDEX "_writing_v_latest_idx" ON "_writing_v" USING btree ("latest");
  CREATE INDEX "_writing_v_autosave_idx" ON "_writing_v" USING btree ("autosave");
  CREATE INDEX "_writing_v_rels_order_idx" ON "_writing_v_rels" USING btree ("order");
  CREATE INDEX "_writing_v_rels_parent_idx" ON "_writing_v_rels" USING btree ("parent_id");
  CREATE INDEX "_writing_v_rels_path_idx" ON "_writing_v_rels" USING btree ("path");
  CREATE INDEX "_writing_v_rels_topics_id_idx" ON "_writing_v_rels" USING btree ("topics_id");
  CREATE INDEX "_writing_v_rels_work_id_idx" ON "_writing_v_rels" USING btree ("work_id");
  CREATE INDEX "craft_fallback_fallback_media_idx" ON "craft" USING btree ("fallback_media_id");
  CREATE INDEX "craft_meta_meta_image_idx" ON "craft" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "craft_slug_idx" ON "craft" USING btree ("slug");
  CREATE INDEX "craft_updated_at_idx" ON "craft" USING btree ("updated_at");
  CREATE INDEX "craft_created_at_idx" ON "craft" USING btree ("created_at");
  CREATE INDEX "craft__status_idx" ON "craft" USING btree ("_status");
  CREATE INDEX "craft_rels_order_idx" ON "craft_rels" USING btree ("order");
  CREATE INDEX "craft_rels_parent_idx" ON "craft_rels" USING btree ("parent_id");
  CREATE INDEX "craft_rels_path_idx" ON "craft_rels" USING btree ("path");
  CREATE INDEX "craft_rels_topics_id_idx" ON "craft_rels" USING btree ("topics_id");
  CREATE INDEX "_craft_v_parent_idx" ON "_craft_v" USING btree ("parent_id");
  CREATE INDEX "_craft_v_version_fallback_version_fallback_media_idx" ON "_craft_v" USING btree ("version_fallback_media_id");
  CREATE INDEX "_craft_v_version_meta_version_meta_image_idx" ON "_craft_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_craft_v_version_version_slug_idx" ON "_craft_v" USING btree ("version_slug");
  CREATE INDEX "_craft_v_version_version_updated_at_idx" ON "_craft_v" USING btree ("version_updated_at");
  CREATE INDEX "_craft_v_version_version_created_at_idx" ON "_craft_v" USING btree ("version_created_at");
  CREATE INDEX "_craft_v_version_version__status_idx" ON "_craft_v" USING btree ("version__status");
  CREATE INDEX "_craft_v_created_at_idx" ON "_craft_v" USING btree ("created_at");
  CREATE INDEX "_craft_v_updated_at_idx" ON "_craft_v" USING btree ("updated_at");
  CREATE INDEX "_craft_v_latest_idx" ON "_craft_v" USING btree ("latest");
  CREATE INDEX "_craft_v_autosave_idx" ON "_craft_v" USING btree ("autosave");
  CREATE INDEX "_craft_v_rels_order_idx" ON "_craft_v_rels" USING btree ("order");
  CREATE INDEX "_craft_v_rels_parent_idx" ON "_craft_v_rels" USING btree ("parent_id");
  CREATE INDEX "_craft_v_rels_path_idx" ON "_craft_v_rels" USING btree ("path");
  CREATE INDEX "_craft_v_rels_topics_id_idx" ON "_craft_v_rels" USING btree ("topics_id");
  CREATE INDEX "recommendations_related_work_idx" ON "recommendations" USING btree ("related_work_id");
  CREATE INDEX "recommendations_updated_at_idx" ON "recommendations" USING btree ("updated_at");
  CREATE INDEX "recommendations_created_at_idx" ON "recommendations" USING btree ("created_at");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");
  CREATE INDEX "topics_updated_at_idx" ON "topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "topics" USING btree ("created_at");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_writing_id_idx" ON "redirects_rels" USING btree ("writing_id");
  CREATE INDEX "redirects_rels_work_id_idx" ON "redirects_rels" USING btree ("work_id");
  CREATE INDEX "redirects_rels_craft_id_idx" ON "redirects_rels" USING btree ("craft_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_work_id_idx" ON "payload_locked_documents_rels" USING btree ("work_id");
  CREATE INDEX "payload_locked_documents_rels_writing_id_idx" ON "payload_locked_documents_rels" USING btree ("writing_id");
  CREATE INDEX "payload_locked_documents_rels_craft_id_idx" ON "payload_locked_documents_rels" USING btree ("craft_id");
  CREATE INDEX "payload_locked_documents_rels_recommendations_id_idx" ON "payload_locked_documents_rels" USING btree ("recommendations_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "profile_experience_order_idx" ON "profile_experience" USING btree ("_order");
  CREATE INDEX "profile_experience_parent_id_idx" ON "profile_experience" USING btree ("_parent_id");
  CREATE INDEX "profile_experience_work_idx" ON "profile_experience" USING btree ("work_id");
  CREATE INDEX "profile_skills_order_idx" ON "profile_skills" USING btree ("_order");
  CREATE INDEX "profile_skills_parent_id_idx" ON "profile_skills" USING btree ("_parent_id");
  CREATE INDEX "profile_education_order_idx" ON "profile_education" USING btree ("_order");
  CREATE INDEX "profile_education_parent_id_idx" ON "profile_education" USING btree ("_parent_id");
  CREATE INDEX "profile_certifications_order_idx" ON "profile_certifications" USING btree ("_order");
  CREATE INDEX "profile_certifications_parent_id_idx" ON "profile_certifications" USING btree ("_parent_id");
  CREATE INDEX "profile_languages_order_idx" ON "profile_languages" USING btree ("_order");
  CREATE INDEX "profile_languages_parent_id_idx" ON "profile_languages" USING btree ("_parent_id");
  CREATE INDEX "profile_cv_file_idx" ON "profile" USING btree ("cv_file_id");
  CREATE INDEX "profile_texts_order_parent" ON "profile_texts" USING btree ("order","parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_writing_id_idx" ON "site_settings_rels" USING btree ("writing_id");
  CREATE INDEX "site_settings_rels_work_id_idx" ON "site_settings_rels" USING btree ("work_id");
  CREATE INDEX "site_settings_rels_craft_id_idx" ON "site_settings_rels" USING btree ("craft_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_writing_id_idx" ON "header_rels" USING btree ("writing_id");
  CREATE INDEX "header_rels_work_id_idx" ON "header_rels" USING btree ("work_id");
  CREATE INDEX "header_rels_craft_id_idx" ON "header_rels" USING btree ("craft_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_writing_id_idx" ON "footer_rels" USING btree ("writing_id");
  CREATE INDEX "footer_rels_work_id_idx" ON "footer_rels" USING btree ("work_id");
  CREATE INDEX "footer_rels_craft_id_idx" ON "footer_rels" USING btree ("craft_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "work_metrics" CASCADE;
  DROP TABLE "work" CASCADE;
  DROP TABLE "work_texts" CASCADE;
  DROP TABLE "work_rels" CASCADE;
  DROP TABLE "_work_v_version_metrics" CASCADE;
  DROP TABLE "_work_v" CASCADE;
  DROP TABLE "_work_v_texts" CASCADE;
  DROP TABLE "_work_v_rels" CASCADE;
  DROP TABLE "writing" CASCADE;
  DROP TABLE "writing_rels" CASCADE;
  DROP TABLE "_writing_v" CASCADE;
  DROP TABLE "_writing_v_rels" CASCADE;
  DROP TABLE "craft" CASCADE;
  DROP TABLE "craft_rels" CASCADE;
  DROP TABLE "_craft_v" CASCADE;
  DROP TABLE "_craft_v_rels" CASCADE;
  DROP TABLE "recommendations" CASCADE;
  DROP TABLE "topics" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "profile_experience" CASCADE;
  DROP TABLE "profile_skills" CASCADE;
  DROP TABLE "profile_education" CASCADE;
  DROP TABLE "profile_certifications" CASCADE;
  DROP TABLE "profile_languages" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "profile_texts" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TYPE "public"."enum_work_status";
  DROP TYPE "public"."enum__work_v_version_status";
  DROP TYPE "public"."enum_writing_language";
  DROP TYPE "public"."enum_writing_format";
  DROP TYPE "public"."enum_writing_status";
  DROP TYPE "public"."enum__writing_v_version_language";
  DROP TYPE "public"."enum__writing_v_version_format";
  DROP TYPE "public"."enum__writing_v_version_status";
  DROP TYPE "public"."enum_craft_demo";
  DROP TYPE "public"."enum_craft_code_language";
  DROP TYPE "public"."enum_craft_status";
  DROP TYPE "public"."enum__craft_v_version_demo";
  DROP TYPE "public"."enum__craft_v_version_code_language";
  DROP TYPE "public"."enum__craft_v_version_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_site_settings_social_links_link_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}
