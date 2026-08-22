'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { Product, Category } from '@/types';
import {
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Eye,
  ShoppingBag,
  Image as ImageIcon,
  Tag,
  Clock,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const {
    products,
    categories,
    addProduct,
    deleteProduct,
    toggleStock,
    addCategory,
    deleteCategory,
    resetToDefaults
  } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');

  // Success notifications
  const [productSuccess, setProductSuccess] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);

  // Custom vs Preset Image mode
  const [imageMode, setImageMode] = useState<'preset' | 'custom'>('preset');

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: categories[0]?.name || 'Fresh Vegetables',
    categoryId: categories[0]?.id || 'veggies',
    price: 60,
    originalPrice: 85,
    discountPercentage: 29,
    rating: 4.9,
    reviewsCount: 12,
    badge: 'Organic' as Product['badge'],
    inStock: true,
    image: '/images/carrots.png',
    thumbnails: ['/images/carrots.png'],
    description: '100% certified pesticide-free organic harvest freshly collected from clean local farms.',
    weights: ['250g', '500g', '1kg', '2kg'],
    isFeatured: true,
    isFlashSale: true,
    healthBenefits: [
      { title: 'Immune Shield', percentage: 90, icon: 'Shield', description: 'Rich in essential daily vitamins and minerals.' }
    ],
    nutrition: {
      calories: '45 kcal',
      protein: '1.2g',
      fiber: '2.5g',
      carbs: '8g',
      vitaminA: '120%',
      vitaminC: '45%',
      iron: '5%',
      storage: 'Refrigerate in crisp drawer.',
      howToConsume: 'Enjoy fresh, cooked or raw.',
      origin: 'Ooty Organic Farms',
      bestBefore: '7 Days'
    },
    reviews: []
  });

  // Category Form State
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/carrots.png',
    icon: 'Leaf'
  });

  const availablePresetImages = [
    { label: 'Carrots Cutout', path: '/images/carrots.png' },
    { label: 'Apples Cutout', path: '/images/apple.png' },
    { label: 'Spinach Cutout', path: '/images/spinach.png' },
    { label: 'Tomatoes Cutout', path: '/images/tomatoes.png' },
    { label: 'Broccoli Cutout', path: '/images/broccoli.png' },
    { label: 'Banana Cutout', path: '/images/banana.png' },
    { label: 'Veggie Harvest Basket', path: '/images/hero_organic_basket.png' },
    { label: 'Tropical Fruit Bowl', path: '/images/hero_fruits_collection.png' },
    { label: 'Exotic Red Capsicum', path: '/images/c4.png' }
  ];

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(
      ((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100
    );

    addProduct({
      ...newProduct,
      discountPercentage: discount > 0 ? discount : 0,
      thumbnails: [newProduct.image]
    });

    setProductSuccess(true);
    setTimeout(() => setProductSuccess(false), 3000);

    setNewProduct((prev) => ({ ...prev, name: '' }));
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-');

    addCategory({
      name: newCategory.name,
      slug,
      description: newCategory.description || 'Fresh organic harvest category.',
      image: newCategory.image || '/images/carrots.png',
      icon: newCategory.icon || 'Leaf',
      productCount: 0
    });

    setCategorySuccess(true);
    setTimeout(() => setCategorySuccess(false), 3000);

    setNewCategory({ name: '', slug: '', description: '', image: '/images/carrots.png', icon: 'Leaf' });
  };

  return (
    <div className="py-5 bg-cream" style={{ paddingTop: '180px', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Top Header Navigation */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-1">
              <ShieldAlert size={18} />
              <span>SUPER ADMIN CONTROL PANEL</span>
            </div>
            <h2 className="font-heading display-6 fw-extrabold text-dark mb-0">
              Produce, Category & Store Control
            </h2>
            <p className="text-muted small mb-0">
              Upload new produce, add categories, manage stock & inspect live storefront inventory.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <button
              onClick={resetToDefaults}
              className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
            >
              <RotateCcw size={14} />
              <span>Reset Inventory</span>
            </button>

            <Link
              href="/"
              className="btn btn-success btn-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
              style={{ background: '#0A6836', border: 'none' }}
            >
              <Eye size={16} />
              <span>View Live Website</span>
            </Link>
          </div>
        </div>

        {/* Metrics Counter Row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-heading fw-extrabold text-dark mb-0">{products.length}</h3>
                <span className="text-muted small">Live Produce</span>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="font-heading fw-extrabold text-dark mb-0">{categories.length}</h3>
                <span className="text-muted small">Active Categories</span>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-heading fw-extrabold text-dark mb-0">128</h3>
                <span className="text-muted small">Total Orders</span>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-heading fw-extrabold text-dark mb-0">₹48,250</h3>
                <span className="text-muted small">Total Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="d-flex align-items-center gap-2 mb-4 bg-white p-2 rounded-4 shadow-sm border w-100 overflow-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeTab === 'products'
                ? 'btn-success text-white shadow-sm'
                : 'btn-light text-dark border-0'
            }`}
            style={activeTab === 'products' ? { background: '#0A6836' } : {}}
          >
            <Package size={16} className="me-2 d-inline" />
            Upload Products & Inventory
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeTab === 'categories'
                ? 'btn-success text-white shadow-sm'
                : 'btn-light text-dark border-0'
            }`}
            style={activeTab === 'categories' ? { background: '#0A6836' } : {}}
          >
            <Layers size={16} className="me-2 d-inline" />
            Manage Categories
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeTab === 'orders'
                ? 'btn-success text-white shadow-sm'
                : 'btn-light text-dark border-0'
            }`}
            style={activeTab === 'orders' ? { background: '#0A6836' } : {}}
          >
            <ShoppingBag size={16} className="me-2 d-inline" />
            Customer Orders Log
          </button>
        </div>

        {/* TAB 1: PRODUCT UPLOAD & INVENTORY */}
        {activeTab === 'products' && (
          <div className="row g-4">
            {/* Left Form: Add New Product */}
            <div className="col-lg-5">
              <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border">
                <h4 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <Plus size={20} className="text-success" />
                  <span>Upload New Fruit / Veggie</span>
                </h4>

                {productSuccess && (
                  <div className="alert alert-success rounded-4 d-flex align-items-center gap-2 small fw-bold mb-4">
                    <CheckCircle2 size={18} />
                    <span>Product uploaded successfully! Now live on website UI.</span>
                  </div>
                )}

                <form onSubmit={handleProductSubmit}>
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Produce Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="e.g. Organic Fresh Dragonfruit"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Category</label>
                      <select
                        className="form-select rounded-3 py-2 px-3 small border"
                        value={newProduct.categoryId}
                        onChange={(e) => {
                          const sel = categories.find((c) => c.id === e.target.value);
                          setNewProduct({
                            ...newProduct,
                            categoryId: e.target.value,
                            category: sel ? sel.name : 'Fresh Vegetables'
                          });
                        }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label fw-bold text-dark small mb-1">Sale Price (₹)</label>
                        <input
                          type="number"
                          className="form-control rounded-3 py-2 px-3 small border"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label fw-bold text-dark small mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          className="form-control rounded-3 py-2 px-3 small border"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    {/* Image Mode Selector */}
                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Product Image Source</label>
                      <div className="d-flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setImageMode('preset')}
                          className={`btn btn-xs rounded-pill px-3 py-1 fw-bold ${
                            imageMode === 'preset' ? 'btn-success text-white' : 'btn-light text-muted border'
                          }`}
                        >
                          Select Studio Cutout
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('custom')}
                          className={`btn btn-xs rounded-pill px-3 py-1 fw-bold ${
                            imageMode === 'custom' ? 'btn-success text-white' : 'btn-light text-muted border'
                          }`}
                        >
                          Custom Image URL
                        </button>
                      </div>

                      {imageMode === 'preset' ? (
                        <select
                          className="form-select rounded-3 py-2 px-3 small border"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        >
                          {availablePresetImages.map((img) => (
                            <option key={img.path} value={img.path}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control rounded-3 py-2 px-3 small border"
                          placeholder="Paste image URL (e.g. https://...)"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        />
                      )}

                      {/* Live Image Preview Card */}
                      <div className="mt-3 p-3 bg-light rounded-4 text-center border">
                        <span className="text-muted small fw-bold d-block mb-2">LIVE IMAGE PREVIEW</span>
                        <div className="position-relative mx-auto bg-white rounded-3 p-2 shadow-sm" style={{ width: '90px', height: '90px' }}>
                          <Image
                            src={newProduct.image || '/images/carrots.png'}
                            alt="Preview"
                            fill
                            className="object-fit-contain p-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Select Badge</label>
                      <select
                        className="form-select rounded-3 py-2 px-3 small border"
                        value={newProduct.badge}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, badge: e.target.value as Product['badge'] })
                        }
                      >
                        <option value="Organic">Organic</option>
                        <option value="Farm Fresh">Farm Fresh</option>
                        <option value="Exotic">Exotic</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Limited Deal">Limited Deal</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Description</label>
                      <textarea
                        rows={2}
                        className="form-control rounded-3 py-2 px-3 small border"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg rounded-pill w-100 py-3 fw-bold shadow border-0"
                    style={{ background: '#0A6836' }}
                  >
                    Publish Produce Live to Website →
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Live Inventory Table */}
            <div className="col-lg-7">
              <div className="bg-white rounded-5 p-4 shadow-sm border">
                <h4 className="font-heading fw-bold text-dark mb-3">
                  Live Storefront Inventory ({products.length})
                </h4>

                <div className="table-responsive" style={{ maxHeight: '580px', overflowY: 'auto' }}>
                  <table className="table table-hover align-middle">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="position-relative rounded-3 bg-light p-1" style={{ width: '44px', height: '44px' }}>
                                <Image src={p.image} alt={p.name} fill className="object-fit-contain p-1" />
                              </div>
                              <div>
                                <strong className="d-block text-dark font-heading small">{p.name}</strong>
                                <span className="badge bg-secondary bg-opacity-10 text-dark small">{p.badge}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="small text-muted">{p.category}</span>
                          </td>

                          <td>
                            <strong className="text-success small">₹{p.price}</strong>
                            <span className="text-muted text-decoration-line-through small ms-1">₹{p.originalPrice}</span>
                          </td>

                          <td>
                            <button
                              onClick={() => toggleStock(p.id)}
                              className={`btn btn-xs rounded-pill px-2 py-1 fw-bold ${
                                p.inStock ? 'btn-success text-white' : 'btn-secondary text-white'
                              }`}
                              style={{ fontSize: '0.68rem' }}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>

                          <td className="text-end">
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="btn btn-sm btn-light text-danger rounded-circle p-2 shadow-sm border"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="row g-4">
            {/* Add New Category Form */}
            <div className="col-lg-5">
              <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border">
                <h4 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <Layers size={20} className="text-success" />
                  <span>Add New Category</span>
                </h4>

                {categorySuccess && (
                  <div className="alert alert-success rounded-4 d-flex align-items-center gap-2 small fw-bold mb-4">
                    <CheckCircle2 size={18} />
                    <span>Category added successfully! Now live on website navigation.</span>
                  </div>
                )}

                <form onSubmit={handleCategorySubmit}>
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Category Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="e.g. Exotic Berries & Melons"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Category Image Source</label>
                      <select
                        className="form-select rounded-3 py-2 px-3 small border mb-2"
                        value={newCategory.image}
                        onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      >
                        {availablePresetImages.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>

                      {/* Live Image Preview Card */}
                      <div className="p-3 bg-light rounded-4 text-center border">
                        <span className="text-muted small fw-bold d-block mb-2">CATEGORY HALO PREVIEW</span>
                        <div className="halo-circle halo-bg-1 rounded-circle mx-auto position-relative" style={{ width: '80px', height: '80px' }}>
                          <Image
                            src={newCategory.image || '/images/carrots.png'}
                            alt="Category Preview"
                            fill
                            className="object-fit-cover rounded-circle p-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-bold text-dark small mb-1">Description</label>
                      <textarea
                        rows={3}
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="Brief summary of this organic category..."
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg rounded-pill w-100 py-3 fw-bold shadow border-0"
                    style={{ background: '#0A6836' }}
                  >
                    Add Category to Website →
                  </button>
                </form>
              </div>
            </div>

            {/* Existing Categories Table */}
            <div className="col-lg-7">
              <div className="bg-white rounded-5 p-4 shadow-sm border">
                <h4 className="font-heading fw-bold text-dark mb-3">
                  Live Active Categories ({categories.length})
                </h4>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Items Count</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="halo-circle halo-bg-2 rounded-circle position-relative flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                                <Image src={c.image} alt={c.name} fill className="object-fit-cover rounded-circle p-1" />
                              </div>
                              <strong className="text-dark font-heading small">{c.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="small text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>{c.description}</span>
                          </td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-success fw-bold">{c.productCount} Items</span>
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => deleteCategory(c.id)}
                              className="btn btn-sm btn-light text-danger rounded-circle p-2 border"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-5 p-4 shadow-sm border">
            <h4 className="font-heading fw-bold text-dark mb-3">Recent Customer Orders Log</h4>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Delivery Slot</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD-9841', name: 'Sanjay Kumar', slot: 'Morning (7am - 10am)', items: 'Carrot 1kg, Apple 500g', total: '₹185', status: 'Out for Delivery' },
                    { id: 'ORD-9840', name: 'Priya Sharma', slot: 'Afternoon (12pm - 3pm)', items: 'Spinach 500g, Tomato 1kg', total: '₹110', status: 'Processing' },
                    { id: 'ORD-9839', name: 'Vikram Mehta', slot: 'Evening (5pm - 8pm)', items: 'Broccoli 500g, Avocado 250g', total: '₹260', status: 'Delivered' }
                  ].map((ord) => (
                    <tr key={ord.id}>
                      <td><strong className="text-dark font-heading small">{ord.id}</strong></td>
                      <td><span className="small font-heading fw-semibold">{ord.name}</span></td>
                      <td><span className="small text-muted">{ord.slot}</span></td>
                      <td><span className="small text-muted">{ord.items}</span></td>
                      <td><strong className="text-success small">{ord.total}</strong></td>
                      <td>
                        <span className={`badge ${
                          ord.status === 'Delivered' ? 'bg-success' : ord.status === 'Out for Delivery' ? 'bg-warning text-dark' : 'bg-primary'
                        } rounded-pill px-3 py-1 small`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
