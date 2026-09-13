CREATE TYPE "public"."category_type" AS ENUM('expense', 'savings', 'income');--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "type" "category_type" DEFAULT 'expense' NOT NULL;