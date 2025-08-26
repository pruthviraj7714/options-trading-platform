/*
  Warnings:

  - You are about to alter the column `price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.

*/
-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "price" SET DATA TYPE DECIMAL(20,8);
