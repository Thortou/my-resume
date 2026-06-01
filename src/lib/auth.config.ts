import type { NextAuthConfig } from 'next-auth';

// Role type for Edge Runtime (no Prisma import)
export type Role = 'USER' | 'ADMIN';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
  }
}

/**
 * Edge-compatible auth configuration
 * This file should NOT import:
 * - Prisma or any database client
 * - bcryptjs or other Node.js crypto libraries
 * - Any server-only libraries
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are added in auth.ts (server-side only)

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },

    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Check if route requires authentication
      if (pathname.startsWith('/admin')) {
        if (!auth?.user) {
          return false;
        }

        // Only ADMIN can access admin routes
        if (auth.user.role !== 'ADMIN') {
          return false;
        }
      }

      return true;
    },
  },

  trustHost: true,
};
