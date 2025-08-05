export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type StorageKey = string;
export type StorageValue = string | number | boolean | object | null;