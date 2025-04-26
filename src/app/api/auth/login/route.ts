import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/password';
import bcrypt from 'bcrypt';

// Demo credentials:
// Email: demo@example.com
// Password: Demo@123

// Pre-hashed passwords for all users
const hashedPasswords = {
  admin: '$2b$10$YaB6xpBcJe8M7rGmWOsLC.YJ0GYPgir6LQ1IXX6.bxiIL0OHE7YGi', // Sarvesh@1234
  user: '$2b$10$YaB6xpBcJe8M7rGmWOsLC.YJ0GYPgir6LQ1IXX6.bxiIL0OHE7YGi',  // Yatin@1234
  demo: '$2b$10$YaB6xpBcJe8M7rGmWOsLC.YJ0GYPgir6LQ1IXX6.bxiIL0OHE7YGi',  // Demo@123
};

// User database with demo account
const users = [
  {
    id: '1',
    name: 'Sarvesh',
    email: 'Sarvesh@sarvinarck.com',
    password: hashedPasswords.admin,
    role: 'admin',
  },
  {
    id: '2',
    name: 'Yatin',
    email: 'Yatin.arora@sarvinarck.com',
    password: hashedPasswords.user,
    role: 'user',
  },
  {
    id: '3',
    name: 'Demo User',
    email: 'demo@example.com',
    password: hashedPasswords.demo,
    role: 'user',
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (case insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
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
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
