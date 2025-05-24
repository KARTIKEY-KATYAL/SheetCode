-- CreateEnum
CREATE TYPE "League" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "league" "League" NOT NULL DEFAULT 'BRONZE';
