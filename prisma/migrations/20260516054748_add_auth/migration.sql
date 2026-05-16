/*
  Warnings:

  - You are about to drop the column `participantId` on the `Attempt` table. All the data in the column will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_participantId_fkey";

-- DropIndex
DROP INDEX "Attempt_participantId_createdAt_idx";

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "participantId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Participant";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Attempt_userId_createdAt_idx" ON "Attempt"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
