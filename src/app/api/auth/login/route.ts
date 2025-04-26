import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/password';

// Temporary in-memory user store with correct password hashes
const users = [
  {
    id: '1',
    name: 'Sarvesh',
    email: 'Sarvesh@sarvinarck.com',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // Sarvesh@1234
    role: 'admin',
  },
  {
    id: '2',
    name: 'Yatin',
    email: 'Yatin.arora@sarvinarck.com',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // Yatin@1234
    role: 'user',
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password using the utility function
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
