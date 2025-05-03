-- DropForeignKey
ALTER TABLE `transaction_items` DROP FOREIGN KEY `transaction_items_transaction_id_fkey`;

-- DropIndex
DROP INDEX `transaction_items_transaction_id_fkey` ON `transaction_items`;

-- AlterTable
ALTER TABLE `transaction_items` MODIFY `transaction_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
