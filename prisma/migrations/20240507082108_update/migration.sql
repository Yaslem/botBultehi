/*
  Warnings:

  - You are about to drop the column `hasCnters` on the `result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `result` DROP COLUMN `hasCnters`,
    ADD COLUMN `hasCenters` BOOLEAN NOT NULL DEFAULT false;
