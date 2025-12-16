export interface CreateDiscount {
  name: string,
  description: string,
  type: "percent" | "fixed",
  value: number,
  start_date?: Date,
  end_date?: Date,
}

export type UpdateDiscount = Partial<CreateDiscount>