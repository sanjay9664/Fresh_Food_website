'use client';

import React, { useEffect, useState } from 'react';
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
    allProducts,
    categories,
    addProduct,
    deleteProduct,
    toggleStock,
    toggleProductAdded,
    addCategory,
    deleteCategory,
    resetToDefaults
  } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'notifications' | 'system'>('products');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; audience: string; sentAt: string }>>([]);
  const [notificationDraft, setNotificationDraft] = useState({ title: '', message: '', audience: 'All customers' });
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Out for Delivery' | 'Delivered'>('All');

  // Frontend-only demo data. API data will replace this only when backend integration is requested.
  const orders = [
    { id: 'ORD-1048', name: 'Aarav Sharma', phone: '98765 41230', date: 'Today, 10:24 AM', slot: 'Evening · 5 PM - 8 PM', items: 'Alphonso Mango 1kg, Avocado 500g', count: 2, total: 548, status: 'Pending' },
    { id: 'ORD-1047', name: 'Priya Verma', phone: '98110 23567', date: 'Today, 09:45 AM', slot: 'Morning · 7 AM - 10 AM', items: 'Carrot 1kg, Spinach 500g, Tomato 1kg', count: 3, total: 285, status: 'Out for Delivery' },
    { id: 'ORD-1046', name: 'Rohan Mehta', phone: '98910 78234', date: 'Today, 08:15 AM', slot: 'Afternoon · 12 PM - 3 PM', items: 'Green Apple 1kg, Broccoli 500g', count: 2, total: 360, status: 'Delivered' },
    { id: 'ORD-1045', name: 'Neha Singh', phone: '99871 44128', date: 'Yesterday, 06:38 PM', slot: 'Morning · 7 AM - 10 AM', items: 'Organic Banana 1kg, Capsicum 500g', count: 2, total: 230, status: 'Pending' },
    { id: 'ORD-1044', name: 'Vikram Patel', phone: '97654 89102', date: 'Yesterday, 04:20 PM', slot: 'Evening · 5 PM - 8 PM', items: 'Fresh Tomato 1kg, Potato 2kg, Onion 1kg', count: 3, total: 315, status: 'Delivered' },
    { id: 'ORD-1043', name: 'Kavya Nair', phone: '99102 37465', date: 'Yesterday, 01:15 PM', slot: 'Afternoon · 12 PM - 3 PM', items: 'Dragonfruit 500g, Kiwi 500g', count: 2, total: 495, status: 'Out for Delivery' },
    { id: 'ORD-1042', name: 'Ankit Gupta', phone: '98220 56430', date: '24 Aug, 11:30 AM', slot: 'Morning · 7 AM - 10 AM', items: 'Cauliflower 1pc, Carrot 1kg', count: 2, total: 178, status: 'Delivered' },
    { id: 'ORD-1041', name: 'Sneha Kapoor', phone: '97721 34510', date: '24 Aug, 09:10 AM', slot: 'Afternoon · 12 PM - 3 PM', items: 'Apple 1kg, Banana 1kg, Spinach 500g', count: 3, total: 405, status: 'Pending' }
  ];
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const deliveryOrders = orders.filter((order) => order.status === 'Out for Delivery').length;
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const visibleOrders = orderFilter === 'All' ? orders : orders.filter((order) => order.status === orderFilter);

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

  useEffect(() => {
    const savedNotifications = localStorage.getItem('freshvana_admin_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed)) setNotifications(parsed);
      } catch {
        // Ignore malformed browser-only notification data.
      }
    }
  }, []);

  const sendNotification = (event: React.FormEvent) => {
    event.preventDefault();
    const notification = {
      id: `notice-${Date.now()}`,
      title: notificationDraft.title.trim(),
      message: notificationDraft.message.trim(),
      audience: notificationDraft.audience,
      sentAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    const updated = [notification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('freshvana_admin_notifications', JSON.stringify(updated));
    setNotificationDraft({ title: '', message: '', audience: 'All customers' });
    setNotificationSuccess(true);
    setTimeout(() => setNotificationSuccess(false), 3000);
  };

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
      <aside className="admin-sidebar d-none d-xl-flex flex-column bg-white border-end shadow-sm">
        <div className="px-4 pt-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-2"><ShieldAlert size={18} /> WORKSPACE</div>
          <h5 className="font-heading fw-bold mb-1">Super Admin</h5>
          <p className="small text-muted mb-0">Frontend control center</p>
        </div>
        <nav className="p-3 d-flex flex-column gap-1 flex-grow-1">
          {[
            { id: 'products', label: 'Products & Inventory', icon: Package },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'notifications', label: 'Send Notifications', icon: Truck },
            { id: 'system', label: 'System Management', icon: ShieldAlert }
          ].map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveTab(item.id as typeof activeTab)} className={`btn text-start rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${activeTab === item.id ? 'btn-success text-white' : 'btn-light text-dark border-0'}`} style={activeTab === item.id ? { background: '#0A6836' } : {}}><Icon size={17} />{item.label}</button>;
          })}
        </nav>
        <div className="p-3 border-top">
          <Link href="/" className="btn btn-outline-success w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"><Eye size={16} />View storefront</Link>
        </div>
      </aside>

      <div className="container py-3 admin-main-container">
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
                <h3 className="font-heading fw-extrabold text-dark mb-0">{orders.length}</h3>
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
                <h3 className="font-heading fw-extrabold text-dark mb-0">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <span className="text-muted small">Order Value</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="d-flex align-items-center gap-2 mb-4 bg-white p-2 rounded-4 shadow-sm border w-100 overflow-auto d-xl-none">
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
            <div className="col-lg-4 col-xl-3">
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

            {/* Right: Live Inventory Table & Super Admin Control */}
            <div className="col-lg-8 col-xl-9">
              <div className="bg-white rounded-5 p-4 shadow-sm border">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <div>
                    <h4 className="font-heading fw-bold text-dark mb-0">
                      Super Admin Inventory Control
                    </h4>
                    <span className="text-muted small">
                      {products.length} Active in Store • {allProducts.length - products.length} Hidden from Customers
                    </span>
                  </div>

                  <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2">
                    {allProducts.length} Total Master Produce
                  </span>
                </div>

                <div className="table-responsive d-none d-xl-block" style={{ maxHeight: '580px', overflowY: 'auto' }}>
                  <table className="table table-hover align-middle admin-inventory-table">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Fruit / Vegetable</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Super Admin Store Add</th>
                        <th>Stock</th>
                        <th className="text-end admin-action-heading">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((p) => {
                        const isAddedToStore = p.isAdded !== false;

                        return (
                          <tr key={p.id} className={!isAddedToStore ? 'bg-light bg-opacity-50' : ''}>
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

                            {/* Super Admin Store Visibility Add Toggle */}
                            <td>
                              <button
                                type="button"
                                onClick={() => toggleProductAdded(p.id)}
                                className={`btn btn-xs rounded-pill px-3 py-1 fw-bold transition-all shadow-sm ${
                                  isAddedToStore
                                    ? 'btn-success text-white'
                                    : 'btn-outline-secondary text-muted'
                                }`}
                                style={{ fontSize: '0.72rem' }}
                                title={isAddedToStore ? 'Click to hide from customer website' : 'Click to add to customer website'}
                              >
                                {isAddedToStore ? '✓ Added to Store' : '+ Add to Store'}
                              </button>
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

                            <td className="text-end admin-action-cell">
                              <div className="d-flex align-items-center justify-content-end gap-2">
                                <button
                                onClick={() => setViewingProduct(p)}
                                className="btn btn-sm btn-light text-success rounded-circle p-2 shadow-sm border"
                                title="View complete produce details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="btn btn-sm btn-light text-danger rounded-circle p-2 shadow-sm border"
                                title="Delete Item"
                              >
                                <Trash2 size={14} />
                              </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="d-xl-none d-flex flex-column gap-3">
                  {allProducts.map((product) => {
                    const isLive = product.isAdded !== false;
                    return (
                      <article key={product.id} className="admin-product-card border rounded-4 p-3">
                        <div className="d-flex align-items-start gap-3">
                          <div className="position-relative rounded-3 bg-light flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                            <Image src={product.image} alt={product.name} fill className="object-fit-contain p-1" />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-start justify-content-between gap-2"><div><strong className="d-block text-dark font-heading">{product.name}</strong><span className="small text-muted">{product.category} · {product.badge}</span></div><strong className="text-success text-nowrap">₹{product.price}</strong></div>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              <button type="button" onClick={() => toggleProductAdded(product.id)} className={`btn btn-sm rounded-pill px-3 fw-bold ${isLive ? 'btn-success' : 'btn-outline-secondary'}`} style={isLive ? { background: '#0A6836' } : {}}>{isLive ? 'Live on Store' : 'Hidden'}</button>
                              <button onClick={() => toggleStock(product.id)} className={`btn btn-sm rounded-pill px-3 fw-bold ${product.inStock ? 'btn-outline-success' : 'btn-outline-secondary'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</button>
                              <button onClick={() => setViewingProduct(product)} className="btn btn-sm btn-light border text-success rounded-circle" aria-label={`View ${product.name}`}><Eye size={15} /></button>
                              <button onClick={() => deleteProduct(product.id)} className="btn btn-sm btn-light border text-danger rounded-circle" aria-label={`Delete ${product.name}`}><Trash2 size={15} /></button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 text-success small fw-bold mb-1"><ShoppingBag size={17} /> ORDER MANAGEMENT</div>
                <h4 className="font-heading fw-bold text-dark mb-1">Customer orders & delivery status</h4>
                <p className="small text-muted mb-0">See every customer, their items, delivery slot and order progress.</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {(['All', 'Pending', 'Out for Delivery', 'Delivered'] as const).map((filter) => <button key={filter} onClick={() => setOrderFilter(filter)} className={`btn btn-sm rounded-pill px-3 fw-bold ${orderFilter === filter ? 'btn-success' : 'btn-light border'}`} style={orderFilter === filter ? { background: '#0A6836' } : {}}>{filter === 'All' ? `All (${orders.length})` : filter}</button>)}
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3"><div className="admin-order-stat bg-light rounded-4 p-3 h-100"><span className="small text-muted d-block">Total orders</span><strong className="fs-3">{orders.length}</strong></div></div>
              <div className="col-6 col-lg-3"><div className="admin-order-stat bg-warning bg-opacity-10 rounded-4 p-3 h-100"><span className="small text-muted d-block">Pending action</span><strong className="fs-3 text-warning">{pendingOrders}</strong></div></div>
              <div className="col-6 col-lg-3"><div className="admin-order-stat bg-primary bg-opacity-10 rounded-4 p-3 h-100"><span className="small text-muted d-block">Out for delivery</span><strong className="fs-3 text-primary">{deliveryOrders}</strong></div></div>
              <div className="col-6 col-lg-3"><div className="admin-order-stat bg-success bg-opacity-10 rounded-4 p-3 h-100"><span className="small text-muted d-block">Delivered</span><strong className="fs-3 text-success">{deliveredOrders}</strong></div></div>
            </div>

            <div className="row g-3 mb-4">
              {visibleOrders.map((order) => <div className="col-12 col-xl-6" key={order.id}><div className="border rounded-4 p-3 h-100 admin-order-card"><div className="d-flex justify-content-between gap-3"><div><strong className="font-heading">{order.name}</strong><span className="d-block small text-muted">{order.phone} · {order.id}</span></div><span className={`badge align-self-start rounded-pill px-3 py-2 ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Out for Delivery' ? 'bg-primary' : 'bg-warning text-dark'}`}>{order.status}</span></div><p className="small text-dark mb-1 mt-3">{order.items}</p><div className="d-flex justify-content-between gap-2 small text-muted"><span>{order.count} items · {order.slot}</span><strong className="text-success">₹{order.total}</strong></div><small className="text-muted d-block mt-2">Ordered {order.date}</small></div></div>)}
            </div>

            <h5 className="font-heading fw-bold text-dark mb-3">Recent orders table</h5>

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

        {activeTab === 'notifications' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border">
                <div className="d-flex align-items-center gap-2 mb-2 text-success"><Truck size={20} /><span className="fw-bold small">CUSTOMER COMMUNICATION</span></div>
                <h4 className="font-heading fw-bold mb-2">Send a notification</h4>
                <p className="small text-muted mb-4">Create announcements for customers. This is saved only in this browser until backend messaging is connected.</p>
                {notificationSuccess && <div className="alert alert-success rounded-4 small fw-bold">Notification saved successfully.</div>}
                <form onSubmit={sendNotification} className="d-flex flex-column gap-3">
                  <div><label className="form-label small fw-bold">Send to</label><select className="form-select rounded-3" value={notificationDraft.audience} onChange={(e) => setNotificationDraft({ ...notificationDraft, audience: e.target.value })}><option>All customers</option><option>Active customers</option><option>New customers</option></select></div>
                  <div><label className="form-label small fw-bold">Notification title</label><input required className="form-control rounded-3" placeholder="e.g. Fresh mangoes are here!" value={notificationDraft.title} onChange={(e) => setNotificationDraft({ ...notificationDraft, title: e.target.value })} /></div>
                  <div><label className="form-label small fw-bold">Message</label><textarea required rows={4} className="form-control rounded-3" placeholder="Write your customer update..." value={notificationDraft.message} onChange={(e) => setNotificationDraft({ ...notificationDraft, message: e.target.value })} /></div>
                  <button className="btn btn-success rounded-pill py-3 fw-bold" style={{ background: '#0A6836' }}>Save notification →</button>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="bg-white rounded-5 p-4 shadow-sm border h-100">
                <h4 className="font-heading fw-bold mb-1">Notification history</h4>
                <p className="small text-muted mb-4">{notifications.length} browser-saved notification{notifications.length === 1 ? '' : 's'}</p>
                {notifications.length === 0 ? <div className="text-center text-muted py-5"><Truck size={34} className="mb-2" /><p className="mb-0">No notifications created yet.</p></div> : <div className="d-flex flex-column gap-3">{notifications.map((notification) => <div key={notification.id} className="border rounded-4 p-3"><div className="d-flex justify-content-between gap-3"><strong>{notification.title}</strong><span className="badge bg-success bg-opacity-10 text-success align-self-start">{notification.audience}</span></div><p className="small text-muted mb-2 mt-2">{notification.message}</p><small className="text-muted">Saved {notification.sentAt}</small></div>)}</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="row g-4">
            <div className="col-md-6 col-xl-4"><div className="bg-white rounded-5 p-4 shadow-sm border h-100"><ShieldAlert className="text-success mb-3" size={28} /><h5 className="font-heading fw-bold">Access management</h5><p className="small text-muted">All signed-in users have Super Admin workspace access in the current frontend setup.</p><span className="badge bg-success">Frontend enabled</span></div></div>
            <div className="col-md-6 col-xl-4"><div className="bg-white rounded-5 p-4 shadow-sm border h-100"><Package className="text-success mb-3" size={28} /><h5 className="font-heading fw-bold">Store data</h5><p className="small text-muted">Products, categories and notification drafts are stored locally in this browser for now.</p><Link href="/" className="btn btn-sm btn-outline-success rounded-pill">Open storefront</Link></div></div>
            <div className="col-md-6 col-xl-4"><div className="bg-white rounded-5 p-4 shadow-sm border h-100"><Layers className="text-success mb-3" size={28} /><h5 className="font-heading fw-bold">Backend connection</h5><p className="small text-muted">Backend configuration is intentionally not available here. No Marketplace-Backend files or APIs have been changed.</p><span className="badge bg-secondary">Not connected</span></div></div>
          </div>
        )}

        {viewingProduct && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ background: 'rgba(17, 24, 39, 0.62)', zIndex: 2000 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${viewingProduct.name} details`}
            onClick={() => setViewingProduct(null)}
          >
            <div
              className="bg-white rounded-5 shadow-lg p-4 p-md-5 w-100"
              style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative rounded-4 bg-light" style={{ width: '88px', height: '88px' }}>
                    <Image src={viewingProduct.image} alt={viewingProduct.name} fill className="object-fit-contain p-2" />
                  </div>
                  <div>
                    <span className="badge bg-success bg-opacity-10 text-success mb-1">{viewingProduct.category}</span>
                    <h3 className="font-heading fw-bold mb-1">{viewingProduct.name}</h3>
                    <span className="text-success fw-bold">₹{viewingProduct.price}</span>
                    <span className="text-muted text-decoration-line-through ms-2">₹{viewingProduct.originalPrice}</span>
                  </div>
                </div>
                <button onClick={() => setViewingProduct(null)} className="btn btn-light rounded-circle border" aria-label="Close details">×</button>
              </div>

              <p className="text-muted mb-4">{viewingProduct.description}</p>
              <div className="row g-3 small">
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Availability</strong><br />{viewingProduct.inStock ? 'In stock' : 'Out of stock'}</div></div>
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Store status</strong><br />{viewingProduct.isAdded !== false ? 'Live on store' : 'Hidden'}</div></div>
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Rating</strong><br />{viewingProduct.rating} / 5 ({viewingProduct.reviewsCount} reviews)</div></div>
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Available sizes</strong><br />{viewingProduct.weights.join(', ')}</div></div>
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Origin</strong><br />{viewingProduct.nutrition.origin}</div></div>
                <div className="col-6 col-md-4"><div className="bg-light rounded-3 p-3"><strong>Best before</strong><br />{viewingProduct.nutrition.bestBefore}</div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
