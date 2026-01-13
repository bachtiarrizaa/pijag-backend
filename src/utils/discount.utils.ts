import { Decimal } from "@prisma/client/runtime/library";

export class DiscountUtils {
  static calculateDiscount(product: any) {
    try {
      let finalPrice: Decimal = product.price;
      let discount = null;

      if (product.discounts && product.discounts.length > 0) {
        const activeDiscount = product.discounts[0].discount;

        if (activeDiscount && activeDiscount.value) {
          const discountValue = activeDiscount.value;

          if (activeDiscount.type === "percent") {
            finalPrice = finalPrice
              .mul(new Decimal(100).minus(discountValue))
              .div(new Decimal(100));
          } else {
            finalPrice = finalPrice.minus(discountValue);
          }

          // discount = activeDiscount;
          const { id, name, type, value, startDate, endDate } = activeDiscount;

          discount = { id, name, type, value, startDate, endDate };
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        finalPrice: finalPrice,
        discount,
        stock: product.stock,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    } catch (error) {
      throw error;
    };
  };
}