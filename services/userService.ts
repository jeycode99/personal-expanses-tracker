import { User, UserResult, UserUpdateData } from '@/types';
import { storageService } from './storageService';

class UserService {
  private readonly USER_KEY = 'user_data';

  /**
   * Save user data to storage
   */
  async saveUser(user: User): Promise<UserResult> {
    const result = await storageService.setItem(this.USER_KEY, user);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, user };
  }

  /**
   * Get user data from storage
   */
  async getUser(): Promise<UserResult> {
    const result = await storageService.getItem<User>(this.USER_KEY);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, user: result.data };
  }

  /**
   * Update user data
   */
  async updateUser(updateData: UserUpdateData): Promise<UserResult> {
    // Get current user data
    const currentUserResult = await this.getUser();
    if (!currentUserResult.success || !currentUserResult.user) {
      return { success: false, error: 'No user data found' };
    }

    // Merge with update data
    const updatedUser: User = {
      ...currentUserResult.user,
      ...updateData,
    };

    // Save updated user
    return await this.saveUser(updatedUser);
  }

  /**
   * Remove user data from storage
   */
  async removeUser(): Promise<UserResult> {
    const result = await storageService.removeItem(this.USER_KEY);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  }

  /**
   * Generate user ID (simple implementation)
   */
  generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;