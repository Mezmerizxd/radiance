/*
  Warnings:

  - You are about to drop the column `messageGroupId` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the `MessageGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_messageGroupId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "messageGroupId";

-- DropTable
DROP TABLE "MessageGroups";
