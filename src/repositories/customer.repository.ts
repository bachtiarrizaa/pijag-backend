import prisma from "../config/prisma.config";

export class CustomerRepository {
  static async findByUserId(userId: number) {
    try {
      const customer = await prisma.customer.findFirst({
        where: { userId }
      });
      return customer;
    } catch (error) {
      throw error;
    };
  };

  static async findByCustomerId(customerId: number) {
    try {
      const customer = await prisma.customer.findFirst({
        where: { id: customerId }
      });
      return customer;
    } catch (error) {
      throw error;
    };
  }

  static async create (userId: number) {
    try {
      const customer = await prisma.customer.create({
        data: {
          userId: userId,
          points: 0
        },
      });

      return customer;
    } catch (error) {
      throw error;
    }
  }
}