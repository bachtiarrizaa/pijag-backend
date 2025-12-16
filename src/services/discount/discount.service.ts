import prisma from "../../config/prisma.config";
import { CreateDiscount, UpdateDiscount } from "../../types/discount/discount";

export const createDiscountService = async (data: CreateDiscount) => {
  const { name, description, value, type, start_date, end_date } = data;

  if (!name || name.trim() === "") {
    const error: any = new Error("Name cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  if (value <= 0) {
    const error: any = new Error("Discount value must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  if (!["percent", "fixed"].includes(type)) {
    const error: any = new Error("Invalid discount type");
    error.statusCode = 400;
    throw error;
  }

  if (type === "percent" && value > 100) {
    const error: any = new Error("Percent discount cannot exceed 100%");
    error.statusCode = 400;
    throw error;
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    const error: any = new Error("Start date must be before end date");
    error.statusCode = 400;
    throw error;
  }

  const discount = await prisma.discount.create({
    data: {
      name: name.trim(),
      description,
      type,
      value,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      is_active: true
    }
  });

  return discount;
};

export const getDiscountService = async (type?: "percent" | "fixed") => {
  const discounts = await prisma.discount.findMany({
    where: type ? { type } : {},
    orderBy: {
      created_at: "desc",
    },
  });

  return discounts;
};

export const updateDiscountService = async(discountId: number, data: UpdateDiscount) => {
  const { name, description, value, type, start_date, end_date } = data;

  const discount = await prisma.discount.findUnique({
    where: { id: discountId }
  });
  
  if (!discount) {
    const error: any = new Error("Discount not found");
    error.statusCode = 404;
    throw error;
  }

  if (name && name.trim() === "") {
    const existing = await prisma.discount.findFirst({
      where: {
        name,
        NOT: { id: discountId }
      }
    });

    if (existing) {
      const error: any = new Error("Discount already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  if (value !== undefined && value <= 0) {
    const error: any = new Error("Discount value must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  if (type && !["percent", "fixed"].includes(type)) {
    const error: any = new Error("Invalid discount type");
    error.statusCode = 400;
    throw error;
  }

  if (type === "percent" && value! > 100) {
    const error: any = new Error("Percent discount cannot exceed 100%");
    error.statusCode = 400;
    throw error;
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    const error: any = new Error("Start date must be before end date");
    error.statusCode = 400;
    throw error;
  }

  const dataToUpdate: any = {};
  if (name) dataToUpdate.name = name.trim();
  if (description !== undefined) dataToUpdate.description = description;
  if (type) dataToUpdate.type = type;
  if (value !== undefined) dataToUpdate.value = value;
  if (start_date !== undefined) dataToUpdate.start_date = start_date ? new Date(start_date) : null;
  if (end_date !== undefined) dataToUpdate.end_date = end_date ? new Date(end_date) : null;

  const updateDiscount = await prisma.discount.update({
    where: { id: discountId },
    data: dataToUpdate,
  });

  return updateDiscount;
}

export const deleteDiscountService = async(discountId: number) => {
  const discount = await prisma.discount.findUnique({
    where: { id: discountId }
  });

  if (!discount) {
    const error: any = new Error("Discount not found");
    error.statusCode = 404;
    throw error;
  }

  const deleteDiscount = await prisma.discount.delete({
    where: { id: discountId }
  });

  return deleteDiscount;
}