import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate URL-safe ASCII slug
function generateSlug(name: string, prefix: string): string {
  const asciiSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);

  if (!asciiSlug || asciiSlug.length < 3) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${timestamp}-${random}`;
  }

  return asciiSlug;
}

// Check if slug contains non-ASCII characters
function hasNonAscii(str: string): boolean {
  return /[^\x00-\x7F]/.test(str);
}

async function fixSlugs() {
  console.log('Starting slug fix...\n');

  // Fix product slugs
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  let productCount = 0;
  for (const product of products) {
    if (product.slug && hasNonAscii(product.slug)) {
      const newSlug = generateSlug(product.name, 'product');

      // Ensure unique slug
      let finalSlug = newSlug;
      let counter = 1;
      while (
        await prisma.product.findFirst({
          where: { slug: finalSlug, id: { not: product.id } },
        })
      ) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { slug: finalSlug },
      });

      console.log(`Product: "${product.name}"`);
      console.log(`  Old: ${product.slug}`);
      console.log(`  New: ${finalSlug}\n`);
      productCount++;
    }
  }

  // Fix category slugs
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  let categoryCount = 0;
  for (const category of categories) {
    if (category.slug && hasNonAscii(category.slug)) {
      const newSlug = generateSlug(category.name, 'category');

      // Ensure unique slug
      let finalSlug = newSlug;
      let counter = 1;
      while (
        await prisma.category.findFirst({
          where: { slug: finalSlug, id: { not: category.id } },
        })
      ) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }

      await prisma.category.update({
        where: { id: category.id },
        data: { slug: finalSlug },
      });

      console.log(`Category: "${category.name}"`);
      console.log(`  Old: ${category.slug}`);
      console.log(`  New: ${finalSlug}\n`);
      categoryCount++;
    }
  }

  console.log('='.repeat(50));
  console.log(`Fixed ${productCount} product slugs`);
  console.log(`Fixed ${categoryCount} category slugs`);
  console.log('Done!');
}

fixSlugs()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
