-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
