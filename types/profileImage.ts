export interface ProfileImageResult {
  success: boolean;
  imageUri?: string | null;
  error?: string;
}

export interface ProfileImageUploadProps {
  size?: number;
  storageKey?: string;
  initialImage?: string | null;
  onImageChange?: (imageUri: string | null) => void;
  uploadOptions?: import('./imageUpload').ImageUploadOptions;
}

export interface ProfileImageState {
  imageUri: string | null;
  loading: boolean;
  error?: string;
}

export const PROFILE_IMAGE_KEYS = {
  DEFAULT: 'profile_image',
  AVATAR: 'user_avatar',
  COVER: 'cover_image',
} as const;

export type ProfileImageKey = typeof PROFILE_IMAGE_KEYS[keyof typeof PROFILE_IMAGE_KEYS];