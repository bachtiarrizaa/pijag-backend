-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_voucher_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `shift_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
