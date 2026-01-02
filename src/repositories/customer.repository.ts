import prisma from "../config/prisma.config";

export class CustomerRepository {
  static async create (userId: number) {
    try {
      const customer = await prisma.customer.create({
        data: {
          user_id: userId,
          points: 0
        },
      });

      return customer;
    } catch (error) {
      throw error;
    }
  }
}