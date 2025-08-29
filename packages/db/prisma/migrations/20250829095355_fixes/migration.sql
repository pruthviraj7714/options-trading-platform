/*
  Warnings:

  - A unique constraint covering the columns `[timestamp,id]` on the table `Trade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Trade_id_timestamp_key";

-- CreateIndex
CREATE UNIQUE INDEX "Trade_timestamp_id_key" ON "public"."Trade"("timestamp", "id");
