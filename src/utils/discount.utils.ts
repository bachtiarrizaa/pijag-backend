import { Decimal } from "@prisma/client/runtime/library";
import { DiscountType } from "@prisma/client";

export class DiscountUtils {
  static calculateDiscount(product: any) {
    let finalPrice = new Decimal(product.price);
    let discount = null;

    const activeDiscount = product.discounts?.[0]?.discount;

    if (activeDiscount) {
      if (activeDiscount.type === DiscountType.percent) {
        finalPrice = finalPrice
          .mul(new Decimal(100).minus(activeDiscount.value))
          .div(100);
      }

      if (activeDiscount.type === DiscountType.fixed) {
        finalPrice = finalPrice.minus(activeDiscount.value);
      }

      if (finalPrice.lessThan(0)) {
        finalPrice = new Decimal(0);
      }

      discount = {
        ...activeDiscount
      };
    }

    return {
      ...product,
      finalPrice,
      discount,
      discounts: undefined,
    };
  }
}
