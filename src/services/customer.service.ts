import { CustomerRepository } from "../repositories/customer.repository";
import { ErrorHandler } from "../utils/error.utils";

export class CustomerService {
  static async getCustomerById(userId: number) {
    try {
      const customer = await CustomerRepository.findByUserId(userId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found");
      };
      return customer;
    } catch (error) {
      throw error;
    };
  };
}