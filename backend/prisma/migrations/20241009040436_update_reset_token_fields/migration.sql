-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetTokenExpire" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT;
