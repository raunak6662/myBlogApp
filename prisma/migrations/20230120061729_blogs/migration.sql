/*
  Warnings:

  - Added the required column `blogId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Blog_title_key` ON `blog`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `blogId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Comment_blogId_idx` ON `Comment`(`blogId`);
