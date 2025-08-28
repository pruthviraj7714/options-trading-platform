/*
  Warnings:

  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "public"."Trade_id_timestamp_key";

-- AlterTable
ALTER TABLE "public"."Trade" DROP CONSTRAINT "Trade_pkey",
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id", "timestamp");
