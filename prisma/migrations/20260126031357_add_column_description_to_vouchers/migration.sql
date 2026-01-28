/*
  Warnings:

  - Made the column `shift_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_shift_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `shift_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `description` TEXT NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
