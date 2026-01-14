/*
  Warnings:

  - Made the column `order_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payment_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_payment_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_role_id_fkey`;

-- AlterTable
ALTER TABLE `payments` MODIFY `status` ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `transactions` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `payment_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
