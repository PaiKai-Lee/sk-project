-- DropIndex
DROP INDEX `user_refresh_tokens_token_key` ON `user_refresh_tokens`;

-- AlterTable
ALTER TABLE `user_refresh_tokens` MODIFY `token` TEXT NOT NULL;

-- RenameIndex
ALTER TABLE `user_refresh_tokens` RENAME INDEX `user_refresh_tokens_uid_fkey` TO `user_refresh_tokens_uid_idx`;
