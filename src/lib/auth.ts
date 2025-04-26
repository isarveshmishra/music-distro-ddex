import bcrypt from 'bcrypt';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

// In-memory database (replace with actual database later)
const users: User[] = [
  {
    id: '1',
    name: 'Sarvesh',
    email: 'Sarvesh@sarvinarck.com',
    password: 'Sarvesh@1234', // Sarvesh@1234
    role: 'admin',
  },
  {
    id: '2',
    name: 'Yatin',
    email: 'Yatin.arora@sarvinarck.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // Yatin@1234
    role: 'user',
  },
];

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
} 