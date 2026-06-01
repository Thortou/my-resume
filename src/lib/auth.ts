import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './prisma';
import { authConfig, type Role } from './auth.config';

/**
 * Full auth configuration with Credentials provider
 * This file imports Prisma and bcryptjs - only for server-side use
 *
 * DO NOT import this file in middleware.ts - it will bundle Prisma (~800KB+)
 * Use auth.config.ts for Edge Runtime (middleware)
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('Account is disabled');
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),
  ],
});

// Helper to get current session (server-side)
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

// Helper to check if user is admin
export async function isCurrentUserAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

// Re-export Role type for convenience
export type { Role } from './auth.config';
