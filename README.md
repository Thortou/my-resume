# Full Stack Starter

A production-ready full-stack starter template with Next.js 15, TypeScript, Prisma, and more. Features a clean architecture with separate Admin and Website systems.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Ant Design
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Auth.js v5 (NextAuth)
- **File Storage**: Cloudinary
- **Validation**: Zod + React Hook Form
- **Code Quality**: ESLint + Prettier + Husky

## Features

- Clean Architecture (Repository Pattern + Service Layer)
- Role-Based Access Control (RBAC)
- Server Actions
- Middleware Protection
- Environment Validation
- Reusable Components
- Feature-Based Structure
- Type-Safe API
- Responsive Design

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (website)/         # Public website routes
│   ├── (admin)/           # Admin panel routes
│   ├── api/               # API routes
│   └── login/             # Authentication pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   ├── admin/            # Admin-specific components
│   └── website/          # Website-specific components
├── features/             # Feature modules
├── actions/              # Server actions
├── services/             # Business logic layer
├── repositories/         # Data access layer
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── lib/                  # Utilities and configurations
├── configs/              # Application configs
├── constants/            # Constants and enums
├── types/                # TypeScript types
├── schemas/              # Zod validation schemas
└── styles/               # Global styles
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd full-stack-starter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Push database schema:
```bash
npm run db:push
```

7. Seed the database:
```bash
npm run db:seed
```

8. Start the development server:
```bash
npm run dev
```

### Default Credentials

After seeding, you can login with:

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run type-check` | Check TypeScript types |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## Architecture Overview

### Clean Architecture Layers

1. **Presentation Layer** (`app/`, `components/`)
   - Next.js pages and layouts
   - React components
   - Server and client components

2. **Application Layer** (`actions/`, `features/`)
   - Server actions
   - Feature modules
   - Use cases

3. **Domain Layer** (`services/`)
   - Business logic
   - Validation
   - Domain rules

4. **Data Layer** (`repositories/`)
   - Database operations
   - Data mapping
   - Query building

### Authentication Flow

1. User submits credentials
2. Auth.js validates and creates JWT
3. Middleware checks session on protected routes
4. RBAC checks role permissions

### API Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
# Example Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Best Practices

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Security

- Validate all inputs with Zod
- Use parameterized queries (Prisma)
- Implement RBAC
- Secure environment variables

### Performance

- Use Server Components by default
- Implement proper caching
- Optimize images with Cloudinary
- Use code splitting

## Extending the Starter

### Adding a New Feature

1. Create feature folder in `src/features/`
2. Add Prisma model if needed
3. Create repository in `src/repositories/`
4. Create service in `src/services/`
5. Add server actions in `src/actions/`
6. Build components
7. Create pages in `src/app/`

### Adding a New API Route

1. Create route file in `src/app/api/`
2. Add validation schema
3. Implement handlers
4. Add authentication checks

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - see LICENSE file for details.
