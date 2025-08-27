/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Position` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Position" DROP COLUMN "currentPrice",
ALTER COLUMN "leverage" SET DEFAULT 2;
