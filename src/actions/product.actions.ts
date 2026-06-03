'use server';

import { auth } from '@/lib/auth';
import { productService } from '@/services/product.service';
import {
  createProductSchema,
  updateProductSchema,
  productListQuerySchema,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductListQuery,
} from '@/schemas/product.schema';
import type { ActionState } from '@/types';

// Helper to serialize product data (convert Decimal to number)
function serializeProduct(product: any) {
  if (!product) return product;
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };
}

function serializeProducts(products: any[]) {
  return products.map(serializeProduct);
}

// Get all products with pagination and filters (admin)
export async function getProductsAction(query?: Partial<ProductListQuery>) {
  const validatedQuery = productListQuerySchema.safeParse(query || {});
  const options = validatedQuery.success ? validatedQuery.data : {};
  const result = await productService.getAll(options);
  return {
    ...result,
    data: serializeProducts(result.data),
  };
}

// Get all active products for shop (public)
export async function getShopProductsAction(options?: {
  categoryId?: string;
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const result = await productService.getAllActive(options);
  return {
    ...result,
    data: serializeProducts(result.data),
  };
}

// Get featured products (public)
export async function getFeaturedProductsAction(limit?: number) {
  const products = await productService.getFeatured(limit);
  return serializeProducts(products);
}

// Get best selling products (public)
export async function getBestSellingProductsAction(limit?: number) {
  const products = await productService.getBestSelling(limit);
  return serializeProducts(products);
}

// Get product by ID
export async function getProductByIdAction(id: string) {
  const product = await productService.getById(id);
  return serializeProduct(product);
}

// Get product by slug (public)
export async function getProductBySlugAction(slug: string) {
  const product = await productService.getBySlug(slug);
  return serializeProduct(product);
}

// Get products by category (public)
export async function getProductsByCategoryAction(
  categoryId: string,
  limit?: number
) {
  const products = await productService.getByCategory(categoryId, limit);
  return serializeProducts(products);
}

// Get related products (public)
export async function getRelatedProductsAction(
  productId: string,
  categoryId: string,
  limit?: number
) {
  const products = await productService.getRelated(
    productId,
    categoryId,
    limit
  );
  return serializeProducts(products);
}

// Get low stock products (admin)
export async function getLowStockProductsAction(limit?: number) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return [];
  }

  const products = await productService.getLowStock(limit);
  return serializeProducts(products as any[]);
}

// Get out of stock products (admin)
export async function getOutOfStockProductsAction(limit?: number) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return [];
  }

  const products = await productService.getOutOfStock(limit);
  return serializeProducts(products as any[]);
}

// Get product statistics (admin)
export async function getProductStatsAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return productService.getStats();
}

// Create product (admin only)
export async function createProductAction(
  input: CreateProductInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = createProductSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  return productService.create(validatedFields.data, session.user.id);
}

// Update product (admin only)
export async function updateProductAction(
  id: string,
  input: UpdateProductInput
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  // Validate input
  const validatedFields = updateProductSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  return productService.update(id, validatedFields.data, session.user.id);
}

// Delete product (admin only)
export async function deleteProductAction(id: string): Promise<ActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
    };
  }

  return productService.delete(id);
}
