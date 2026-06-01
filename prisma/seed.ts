/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample regular user
  const userPassword = await hash('user123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      isActive: true,
    },
  });

  console.log('✅ Regular user created:', user.email);

  // Create sample products
  const products = [
    {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 29.99,
      isActive: true,
    },
    {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 49.99,
      isActive: true,
    },
    {
      name: 'Product 3',
      description: 'Description for product 3',
      price: 99.99,
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(' ', '-') },
      update: {},
      create: product,
    });
  }

  console.log('✅ Sample products created');

  // Create sample banners
  const banners = [
    {
      title: 'Welcome to Full Stack Starter',
      description: 'Build modern web applications with our production-ready template',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      link: '/about',
      sortOrder: 1,
      isActive: true,
    },
    {
      title: 'Enterprise-Level Architecture',
      description: 'Clean code, scalable patterns, and best practices built-in',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
      link: '/products',
      sortOrder: 2,
      isActive: true,
    },
    {
      title: 'Start Building Today',
      description: 'Everything you need to launch your next project',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80',
      link: '/contact',
      sortOrder: 3,
      isActive: true,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  console.log('✅ Sample banners created');

  console.log('🎉 Database seed completed!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User:  user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
