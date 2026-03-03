-- AlterTable: add method column to endpoints
ALTER TABLE "endpoints" ADD COLUMN "method" TEXT NOT NULL DEFAULT '';

-- Remove the default after backfilling (column is now required)
ALTER TABLE "endpoints" ALTER COLUMN "method" DROP DEFAULT;

-- CreateIndex: unique constraint on (project_id, method, path)
CREATE UNIQUE INDEX "endpoints_project_id_method_path_key" ON "endpoints"("project_id", "method", "path");

-- AlterTable: drop method column from request_logs
ALTER TABLE "request_logs" DROP COLUMN "method";
