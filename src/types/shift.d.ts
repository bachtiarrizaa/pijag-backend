export interface Shift {
  cashStart: string,
  cashEnd: string,
  notes?: string | null,
}

export interface ShiftCreateRequest {
  cashStart: string,
  notes?: string | null,
}

export interface ShiftUpdateRequest {
  cashEnd: string,
  notes?: string | null,
}
