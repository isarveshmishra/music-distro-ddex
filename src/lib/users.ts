// Initial users data
export const initialUsers = [
  {
    id: '1',
    name: 'Sarvesh',
    email: 'Sarvesh@sarvinarck.com',
    password: 'Sarvesh@1234',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Yatin',
    email: 'Yatin.arora@sarvinarck.com',
    password: 'Yatin@1234',
    role: 'user',
  },
  {
    id: '3',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo@123',
    role: 'user',
  },
];

// User type definition
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

// Initialize users in localStorage if not present
export function initializeUsers(): void {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
}

// Get all users
export function getUsers(): User[] {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// Find user by email and password
export function findUser(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

// Add new user
export function addUser(user: User): boolean {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) return false;
  
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

// Update user
export function updateUser(user: User): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index === -1) return false;
  
  users[index] = user;
  localStorage.setItem('users', JSON.stringify(users));
  return true;
} 