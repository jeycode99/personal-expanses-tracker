export * from './imageUpload';
export * from './profileImage';
export * from './storage';

export interface BaseResult {
  success: boolean;
  error?: string;
}

export interface BaseProps {
  style?: any;
  testID?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface UserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ComponentState {
  loading: boolean;
  error?: string;
}