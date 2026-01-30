import cron from "node-cron";
import { OrderService } from "../services/order.service";

export class OrderCron{
  static autoCancelOrder() {
    if (process.env.APP_ENV !== "development") {
      return;
    }

    cron.schedule("* * * * *", async() => {
      try {
        console.log(`Running Auto Cancel Orders CRON`);

        const result = await OrderService.autoCancelOrder();

        if (result.canceledCount > 0) {
          console.log(
            `[CRON] ${result.canceledCount} orders canceled!`
          )
        }
      } catch (error) {
        console.error("Auto-cancel Orders CRON error:", error);
      }
    })
  }
}