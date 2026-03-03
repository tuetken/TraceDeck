-- AlterTable: add database-level DEFAULT for id columns so Prisma Studio
-- and direct SQL inserts can generate IDs without application code.
-- gen_random_uuid() is built into PostgreSQL 13+; no extension needed.
ALTER TABLE "users"        ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "projects"     ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "endpoints"    ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "request_logs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
