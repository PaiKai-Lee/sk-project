/*
  Warnings:

  - You are about to drop the column `staff_code` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_staff_code_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `staff_code`;
