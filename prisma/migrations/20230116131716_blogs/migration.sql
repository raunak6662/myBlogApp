/*
  Warnings:

  - Added the required column `email` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `session` MODIFY `data` LONGTEXT NULL;
