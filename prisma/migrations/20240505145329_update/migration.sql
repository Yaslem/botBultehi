/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `result` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Result_slug_key` ON `Result`(`slug`);
