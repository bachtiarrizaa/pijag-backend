import { Decimal } from "@prisma/client/runtime/library";

export type VoucherType = "percent" | "fixed";

export interface Voucher {
  name: string,
  description?: string | null,
  type: VoucherType,
  value: number,
  minOrder?: number | null,
  startDate?: Date | null,
  endDate?: Date | null,
  isActive: boolean
}

export interface VoucherCreateRequest {
  name: string,
  description?: string | null,
  type: VoucherType,
  value: number,
  minOrder?: number | null,
  startDate?: Date | null,
  endDate?: Date | null,
  isActive: boolean
}

export interface VoucherUpdateRequest {
  name: string,
  description?: string | null,
  type: VoucherType,
  value: number,
  minOrder?: number | null,
  startDate?: Date | null,
  endDate?: Date | null,
}
