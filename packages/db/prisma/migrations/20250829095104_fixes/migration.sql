/*
  Warnings:

  - A unique constraint covering the columns `[id,timestamp]` on the table `Trade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Trade_id_timestamp_key" ON "public"."Trade"("id", "timestamp");
