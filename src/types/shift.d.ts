export interface Shift {
  cashStart: string;
  cashEnd: string;
  notes?: string;
}

export interface ShiftCreateRequest {
  cashStart: string;
  // cashEnd: string;
  notes?: string;
}

export interface ShiftUpdateRequest {
  // cashStart: string;
  cashEnd: string;
  notes?: string;
}
