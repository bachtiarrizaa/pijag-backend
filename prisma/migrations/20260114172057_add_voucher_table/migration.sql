/*
  Warnings:

  - You are about to drop the column `discount_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_discount_id_fkey`;

-- DropIndex
DROP INDEX `orders_discount_id_idx` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `discount_id`,
    ADD COLUMN `voucher_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `vouchers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('percent', 'fixed') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `min_order` DECIMAL(10, 2) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `orders_voucher_id_idx` ON `orders`(`voucher_id`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
