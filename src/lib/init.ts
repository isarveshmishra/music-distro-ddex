import { userService } from '@/services/userService';

export function initializeApp() {
  // Initialize user service (creates default users if none exist)
  userService.initialize();

  // Add more initialization logic here as needed
  console.log('App initialized with local storage services');
} 