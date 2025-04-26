interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}

const USERS_KEY = 'music_users';

// Initialize with default admin user if no users exist
const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // In real app, this should be hashed
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Demo Artist',
        email: 'artist@example.com',
        password: 'artist123',
        role: 'user',
        label: 'Demo Records',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

class UserService {
  private readonly STORAGE_KEY = 'currentUser';

  initialize() {
    initializeUsers();
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  createUser(userData: Partial<User>): User {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      role: userData.role || 'user',
      label: userData.label,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  updateUser(id: string, userData: Partial<User>): User {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date()
    };

    users[index] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return updatedUser;
  }

  deleteUser(id: string): void {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  }

  authenticate(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) { // In real app, use proper password comparison
      return user;
    }
    return null;
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const userService = new UserService(); 