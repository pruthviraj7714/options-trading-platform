/*
  Warnings:

  - Changed the type of `timestamp` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMPTZ(6) NOT NULL;

-- Convert to Hypertable
SELECT create_hypertable('Order', 'timestamp', chunk_time_interval => interval '6 hours');
