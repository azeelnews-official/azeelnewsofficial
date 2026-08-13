-- CreateTable
CREATE TABLE "FactCheck" (
    "id" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactCheck_pkey" PRIMARY KEY ("id")
);
