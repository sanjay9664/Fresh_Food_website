'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category } from '@/types';
import { products as initialProducts } from '@/data/products';
import { categories as initialCategories } from '@/data/categories';

interface ProductContextType {
  products: Product[]; // Active products added by Super Admin for customers
  allProducts: Product[]; // Master inventory list for Super Admin
  categories: Category[];
  addProduct: (newProd: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  toggleProductAdded: (id: string) => void; // Super Admin toggle item visibility
  addCategory: (newCat: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);

  useEffect(() => {
    const savedProducts = localStorage.getItem('freshvana_products');
    const savedCategories = localStorage.getItem('freshvana_categories');

    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductList(parsed);
        }
      } catch (e) {
        console.error('Failed to parse products from local storage', e);
      }
    }

    if (savedCategories) {
      try {
        const parsedCats = JSON.parse(savedCategories);
        if (Array.isArray(parsedCats) && parsedCats.length > 0) {
          setCategoryList(parsedCats);
        }
      } catch (e) {
        console.error('Failed to parse categories from local storage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freshvana_products', JSON.stringify(productList));
  }, [productList]);

  useEffect(() => {
    localStorage.setItem('freshvana_categories', JSON.stringify(categoryList));
  }, [categoryList]);

  // Customer-facing active products (only items added by Super Admin)
  const activeProducts = useMemo(() => {
    return productList.filter((p) => p.isAdded !== false);
  }, [productList]);

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      isAdded: true // Automatically added to active store
    };
    setProductList((prev) => [created, ...prev]);

    // Increment count in category if matched
    setCategoryList((prevCats) =>
      prevCats.map((cat) =>
        cat.id === newProd.categoryId || cat.name === newProd.category
          ? { ...cat, productCount: cat.productCount + 1 }
          : cat
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStock = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const toggleProductAdded = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const currentStatus = p.isAdded !== false;
          return { ...p, isAdded: !currentStatus };
        }
        return p;
      })
    );
  };

  const addCategory = (newCat: Omit<Category, 'id'>) => {
    const catId = newCat.slug || `cat-${Date.now()}`;
    const created: Category = {
      ...newCat,
      id: catId
    };
    setCategoryList((prev) => [...prev, created]);
  };

  const deleteCategory = (id: string) => {
    setCategoryList((prev) => prev.filter((c) => c.id !== id));
  };

  const resetToDefaults = () => {
    setProductList(initialProducts);
    setCategoryList(initialCategories);
    localStorage.removeItem('freshvana_products');
    localStorage.removeItem('freshvana_categories');
  };

  return (
    <ProductContext.Provider
      value={{
        products: activeProducts,
        allProducts: productList,
        categories: categoryList,
        addProduct,
        deleteProduct,
        toggleStock,
        toggleProductAdded,
        addCategory,
        deleteCategory,
        resetToDefaults
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
