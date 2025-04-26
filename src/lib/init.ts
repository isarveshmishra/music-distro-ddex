import { userService } from '@/services/userService';

// Initialize services
export const initializeApp = () => {
  if (typeof window !== 'undefined') {
    userService.initialize();
  }
}; 