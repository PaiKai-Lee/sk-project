/*
  Warnings:

  - You are about to drop the column `content` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `transaction_items` table. All the data in the column will be lost.
  - Added the required column `details` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction_items` DROP COLUMN `content`,
    DROP COLUMN `remark`,
    ADD COLUMN `details` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `remark` TEXT NULL;
