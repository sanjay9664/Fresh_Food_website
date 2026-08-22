'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { products as initialProducts } from '@/data/products';
import { categories as initialCategories } from '@/data/categories';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (newProd: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
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
        setProductList(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse products from local storage', e);
      }
    }

    if (savedCategories) {
      try {
        setCategoryList(JSON.parse(savedCategories));
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

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
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
        products: productList,
        categories: categoryList,
        addProduct,
        deleteProduct,
        toggleStock,
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
