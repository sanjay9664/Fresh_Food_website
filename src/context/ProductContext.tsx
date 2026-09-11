'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Category, Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLocalCategory, addLocalProduct, fetchCatalog, removeLocalCategory, removeLocalProduct, resetCatalog, toggleLocalStock, toggleLocalVisibility } from '@/store/slices/catalogSlice';

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    // Skip catalog requests on isolated vendor, admin, and login routes
    if (pathname?.startsWith('/vendor') || pathname?.startsWith('/admin') || pathname === '/login') {
      return;
    }
    dispatch(fetchCatalog());
  }, [dispatch, pathname]);

  return <>{children}</>;
}

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { products: allProducts, categories } = useAppSelector((state) => state.catalog);
  return {
    products: allProducts.filter((product) => product.isAdded !== false), allProducts, categories,
    addProduct: (product: Omit<Product, 'id'>) => dispatch(addLocalProduct({ ...product, id: `prod-${Date.now()}`, isAdded: true })),
    deleteProduct: (id: string) => dispatch(removeLocalProduct(id)),
    toggleStock: (id: string) => dispatch(toggleLocalStock(id)),
    toggleProductAdded: (id: string) => dispatch(toggleLocalVisibility(id)),
    addCategory: (category: Omit<Category, 'id'>) => dispatch(addLocalCategory({ ...category, id: category.slug || `cat-${Date.now()}` })),
    deleteCategory: (id: string) => dispatch(removeLocalCategory(id)), resetToDefaults: () => dispatch(resetCatalog()),
  };
};
