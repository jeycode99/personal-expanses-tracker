export interface ImageUploadOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export interface ImageUploadResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export type ImagePickerSource = 'camera' | 'gallery';
export type ImageUploadStatus = 'idle' | 'loading' | 'success' | 'error';