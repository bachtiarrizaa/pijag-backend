/*
  Warnings:

  - A unique constraint covering the columns `[product_id,discount_id]` on the table `product_discounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `product_discounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_discounts` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `product_discounts_product_id_discount_id_key` ON `product_discounts`(`product_id`, `discount_id`);
