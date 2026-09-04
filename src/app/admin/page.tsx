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
  Truck,
  Bell,
  Settings,
  TrendingUp,
  Activity,
  ChevronRight,
  Search,
  Filter,
  Download,
  BarChart3,
  Users,
  Leaf,
  EyeOff,
  Store,
  Globe,
  AlertCircle,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; audience: string; sentAt: string }>>([]);
  const [notificationDraft, setNotificationDraft] = useState({ title: '', message: '', audience: 'All customers' });
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Out for Delivery' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    stockQuantityKg: 20,
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

  const filteredProducts = searchQuery
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : allProducts;

  const sidebarItems = [
    { id: 'products', label: 'Products & Inventory', icon: Package, badge: allProducts.length },
    { id: 'categories', label: 'Categories', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <div className="admin-shell">
      {/* Premium Dark Sidebar */}
      <aside className="admin-sidebar-v2 d-none d-xl-flex flex-column">
        {/* Sidebar Brand */}
        <div className="admin-sidebar-brand">
          <div className="d-flex align-items-center gap-3">
            <div className="admin-brand-icon">
              <Leaf size={20} />
            </div>
            <div>
              <h6 className="mb-0 text-white fw-bold" style={{ fontSize: '1.05rem' }}>
                Fresh<span style={{ color: '#4ADE80' }}>Vana</span>
              </h6>
              <span className="d-block" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>
                ADMIN DASHBOARD
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="admin-sidebar-nav">
          <span className="admin-sidebar-label">MAIN MENU</span>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className={`admin-sidebar-icon ${isActive ? 'active' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`admin-sidebar-badge ${isActive ? 'active' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-sidebar-storefront-btn">
            <Globe size={16} />
            <span>View Storefront</span>
            <ChevronRight size={14} className="ms-auto" />
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="d-xl-none position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 3000 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="position-absolute top-0 start-0 h-100 d-flex flex-column"
              style={{ width: '280px', background: 'linear-gradient(180deg, #0F172A 0%, #1A2332 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.3)' }}
            >
              <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="admin-brand-icon">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-white fw-bold">Fresh<span style={{ color: '#4ADE80' }}>Vana</span></h6>
                    <span className="d-block text-white-50" style={{ fontSize: '0.65rem' }}>ADMIN PANEL</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-sm text-white-50 p-1 border-0"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-3 d-flex flex-column gap-2 flex-grow-1">
                <span className="admin-sidebar-label">NAVIGATION</span>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as typeof activeTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className={`admin-sidebar-icon ${isActive ? 'active' : ''}`}>
                          <Icon size={18} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`admin-sidebar-badge ${isActive ? 'active' : ''}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-top border-secondary border-opacity-25">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="admin-sidebar-storefront-btn">
                  <Globe size={16} />
                  <span>View Storefront</span>
                  <ChevronRight size={14} className="ms-auto" />
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="admin-content-area">
        {/* Mobile Header Bar */}
        <div className="d-xl-none mb-3">
          <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 border shadow-sm">
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn btn-light border p-2 d-flex align-items-center justify-content-center rounded-2"
                aria-label="Toggle navigation menu"
              >
                <Menu size={18} className="text-dark" />
              </button>
              <div className="d-flex align-items-center gap-2">
                <div className="admin-brand-icon" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
                  <Leaf size={15} />
                </div>
                <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                  Fresh<span style={{ color: '#059669' }}>Vana</span>
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button onClick={resetToDefaults} className="admin-btn-outline-danger p-2 px-2" style={{ fontSize: '0.75rem' }}>
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <Link href="/" className="admin-btn-primary p-2 px-2" style={{ fontSize: '0.75rem' }}>
                <Eye size={12} />
                <span>Store</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <div className="admin-topbar-indicator" />
                <span className="admin-topbar-label">SUPER ADMIN CONTROL PANEL</span>
              </div>
              <h1 className="admin-topbar-title">
                {activeTab === 'products' && 'Products & Inventory'}
                {activeTab === 'categories' && 'Category Management'}
                {activeTab === 'orders' && 'Order Management'}
                {activeTab === 'notifications' && 'Notifications'}
                {activeTab === 'system' && 'System Management'}
              </h1>
              <p className="admin-topbar-subtitle mb-0">
                {activeTab === 'products' && 'Upload produce, manage stock & control your live storefront inventory.'}
                {activeTab === 'categories' && 'Organize your product categories for seamless navigation.'}
                {activeTab === 'orders' && 'Track customer orders and delivery status in real-time.'}
                {activeTab === 'notifications' && 'Send announcements and updates to your customers.'}
                {activeTab === 'system' && 'System configuration, access management and diagnostics.'}
              </p>
            </div>

            <div className="d-none d-xl-flex align-items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'Badge', 'In Stock', 'Stock (Kg)'];
                  const rows = allProducts.map(p => [
                    p.id,
                    `"${p.name.replace(/"/g, '""')}"`,
                    `"${p.category}"`,
                    p.price,
                    p.originalPrice,
                    p.badge,
                    p.inStock ? 'Yes' : 'No',
                    p.stockQuantityKg || 20
                  ]);
                  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', `freshvana_inventory_${Date.now()}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                title="Export Catalog to CSV"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={resetToDefaults}
                className="admin-btn-outline-danger"
              >
                <RotateCcw size={14} />
                <span className="d-none d-sm-inline">Reset</span>
              </button>

              <Link href="/" className="admin-btn-primary">
                <Eye size={15} />
                <span>Live Store</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Tab Switcher */}
        <div className="admin-mobile-tabs d-xl-none">
          <div className="d-flex align-items-center gap-2 overflow-auto scrollbar-none py-1 px-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`admin-mobile-tab ${isActive ? 'active' : ''}`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Live Produce', value: products.length, icon: Package, gradient: 'stat-green', change: '+3 today' },
            { label: 'Categories', value: categories.length, icon: Layers, gradient: 'stat-amber', change: 'Active' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, gradient: 'stat-blue', change: `${pendingOrders} pending` },
            { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, gradient: 'stat-emerald', change: '+12% this week' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div className="col-6 col-lg-3" key={i}>
                <div className={`admin-stat-card ${stat.gradient}`}>
                  <div className="admin-stat-icon-wrap">
                    <Icon size={22} />
                  </div>
                  <div className="admin-stat-info">
                    <h3 className="admin-stat-value">{stat.value}</h3>
                    <span className="admin-stat-label">{stat.label}</span>
                  </div>
                  <span className="admin-stat-change">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================= */}
        {/* TAB 1: PRODUCT UPLOAD & INVENTORY                             */}
        {/* ============================================================= */}
        {activeTab === 'products' && (
          <div className="row g-4">
            {/* Left: Upload Form */}
            <div className="col-lg-4 col-xl-3">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-card-icon-sm green">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h5 className="admin-card-title mb-0">Add Produce</h5>
                    <span className="admin-card-desc">Upload to live store</span>
                  </div>
                </div>

                <AnimatePresence>
                  {productSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="admin-success-banner"
                    >
                      <CheckCircle2 size={16} />
                      <span>Product published successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleProductSubmit}>
                  <div className="d-flex flex-column gap-3">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Produce Name</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Organic Fresh Dragonfruit"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Category</label>
                      <select
                        className="admin-form-select"
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
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className="admin-form-group">
                          <label className="admin-form-label">Sale Price (₹)</label>
                          <input
                            type="number"
                            className="admin-form-input"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="admin-form-group">
                          <label className="admin-form-label">MRP (₹)</label>
                          <input
                            type="number"
                            className="admin-form-input"
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="admin-form-group">
                          <label className="admin-form-label">Available stock (kg)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.25"
                            className="admin-form-input"
                            value={newProduct.stockQuantityKg}
                            onChange={(e) => setNewProduct({ ...newProduct, stockQuantityKg: Math.max(0, Number(e.target.value)) })}
                            required
                          />
                          <small className="text-muted">Customer purchases are limited to this total quantity across all pack sizes.</small>
                        </div>
                      </div>
                    </div>

                    {/* Image Source */}
                    <div className="admin-form-group">
                      <label className="admin-form-label">Product Image</label>
                      <div className="admin-toggle-group">
                        <button
                          type="button"
                          onClick={() => {
                            setImageMode('preset');
                            if (!newProduct.image || newProduct.image.startsWith('http')) {
                              setNewProduct({ ...newProduct, image: '/images/carrots.png' });
                            }
                          }}
                          className={`admin-toggle-btn ${imageMode === 'preset' ? 'active' : ''}`}
                        >
                          <ImageIcon size={13} />
                          Studio Cutout
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageMode('custom');
                            if (newProduct.image.startsWith('/images/')) {
                              setNewProduct({ ...newProduct, image: '' });
                            }
                          }}
                          className={`admin-toggle-btn ${imageMode === 'custom' ? 'active' : ''}`}
                        >
                          <Globe size={13} />
                          Custom URL
                        </button>
                      </div>

                      {imageMode === 'preset' ? (
                        <select
                          className="admin-form-select mt-2"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        >
                          {availablePresetImages.map((img) => (
                            <option key={img.path} value={img.path}>{img.label}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="position-relative mt-2">
                          <input
                            type="text"
                            className="admin-form-input pe-4"
                            placeholder="Paste image link e.g. https://images.pexels.com/..."
                            value={newProduct.image}
                            onChange={(e) => {
                              let val = e.target.value;
                              // Clean up concatenated local preset path if user pasted over existing value
                              const httpIdx = val.indexOf('http');
                              if (httpIdx > 0) {
                                val = val.substring(httpIdx);
                              }
                              setNewProduct({ ...newProduct, image: val.trim() });
                            }}
                          />
                          {newProduct.image && (
                            <button
                              type="button"
                              onClick={() => setNewProduct({ ...newProduct, image: '' })}
                              className="btn btn-sm text-muted position-absolute end-0 top-50 translate-middle-y me-2 p-0 border-0"
                              title="Clear URL"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Image Preview */}
                      <div className="admin-image-preview mt-3">
                        <div className="position-relative mx-auto" style={{ width: '80px', height: '80px' }}>
                          <Image
                            src={newProduct.image || '/images/carrots.png'}
                            alt="Preview"
                            fill
                            unoptimized
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/carrots.png';
                            }}
                            className="object-fit-contain"
                          />
                        </div>
                        <span className="admin-image-preview-label">LIVE PREVIEW</span>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Badge</label>
                      <select
                        className="admin-form-select"
                        value={newProduct.badge}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, badge: e.target.value as Product['badge'] })
                        }
                      >
                        <option value="Organic">🌿 Organic</option>
                        <option value="Farm Fresh">🌾 Farm Fresh</option>
                        <option value="Exotic">✨ Exotic</option>
                        <option value="Best Seller">🔥 Best Seller</option>
                        <option value="Limited Deal">⏳ Limited Deal</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Description</label>
                      <textarea
                        rows={2}
                        className="admin-form-textarea"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="admin-btn-submit mt-4">
                    <Plus size={18} />
                    <span>Publish to Store</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Inventory Table */}
            <div className="col-lg-8 col-xl-9">
              <div className="admin-card">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                  <div>
                    <h5 className="admin-card-title mb-1">Inventory Control</h5>
                    <span className="admin-card-desc">
                      {products.length} live · {allProducts.length - products.length} hidden · {allProducts.length} total
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Search Bar */}
                    <div className="admin-search-box">
                      <Search size={15} className="admin-search-icon" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="admin-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <span className="admin-badge-count">
                      {allProducts.length} Items
                    </span>
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive d-none d-xl-block" style={{ maxHeight: '560px', overflowY: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Visibility</th>
                        <th>Stock</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        const isAddedToStore = p.isAdded !== false;

                        return (
                          <tr key={p.id} className={!isAddedToStore ? 'row-hidden' : ''}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="admin-product-thumb">
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    unoptimized
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/images/carrots.png';
                                    }}
                                    className="object-fit-contain p-1"
                                  />
                                </div>
                                <div>
                                  <strong className="d-block admin-product-name">{p.name}</strong>
                                  <span className="admin-product-badge">{p.badge}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="admin-cell-text">{p.category}</span>
                            </td>

                            <td>
                              <div className="d-flex align-items-center gap-1">
                                <strong className="admin-price-current">₹{p.price}</strong>
                                <span className="admin-price-original">₹{p.originalPrice}</span>
                              </div>
                            </td>

                            <td>
                              <button
                                type="button"
                                onClick={() => toggleProductAdded(p.id)}
                                className={`admin-visibility-btn ${isAddedToStore ? 'live' : 'hidden'}`}
                              >
                                {isAddedToStore ? (
                                  <><Eye size={13} /> Live</>
                                ) : (
                                  <><EyeOff size={13} /> Hidden</>
                                )}
                              </button>
                            </td>

                            <td>
                              <button
                                onClick={() => toggleStock(p.id)}
                                className={`admin-stock-btn ${p.inStock ? 'in-stock' : 'out-stock'}`}
                              >
                                <span className={`admin-stock-dot ${p.inStock ? 'green' : 'red'}`} />
                                {p.inStock ? 'In Stock' : 'Out'}
                              </button>
                            </td>

                            <td>
                              <div className="d-flex align-items-center justify-content-center gap-2">
                                <button
                                  onClick={() => setViewingProduct(p)}
                                  className="admin-action-btn view"
                                  title="View details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="admin-action-btn delete"
                                  title="Delete"
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

                {/* Mobile Product Cards */}
                <div className="d-xl-none d-flex flex-column gap-3">
                  {filteredProducts.map((product) => {
                    const isLive = product.isAdded !== false;
                    return (
                      <div key={product.id} className="admin-product-mobile-card">
                        <div className="d-flex align-items-start gap-3">
                          <div className="admin-product-thumb-lg">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              unoptimized
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/carrots.png';
                              }}
                              className="object-fit-contain p-1"
                            />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-start justify-content-between gap-2">
                              <div>
                                <strong className="d-block text-dark font-heading" style={{ fontSize: '0.92rem' }}>{product.name}</strong>
                                <span className="admin-cell-text">{product.category} · {product.badge}</span>
                              </div>
                              <strong className="admin-price-current text-nowrap">₹{product.price}</strong>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => toggleProductAdded(product.id)}
                                className={`admin-visibility-btn ${isLive ? 'live' : 'hidden'}`}
                              >
                                {isLive ? <><Eye size={13} /> Live</> : <><EyeOff size={13} /> Hidden</>}
                              </button>
                              <button
                                onClick={() => toggleStock(product.id)}
                                className={`admin-stock-btn ${product.inStock ? 'in-stock' : 'out-stock'}`}
                              >
                                <span className={`admin-stock-dot ${product.inStock ? 'green' : 'red'}`} />
                                {product.inStock ? 'In Stock' : 'Out'}
                              </button>
                              <div className="d-flex gap-1 ms-auto">
                                <button onClick={() => setViewingProduct(product)} className="admin-action-btn view"><Eye size={14} /></button>
                                <button onClick={() => deleteProduct(product.id)} className="admin-action-btn delete"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: CATEGORY MANAGEMENT                                    */}
        {/* ============================================================= */}
        {activeTab === 'categories' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-card-icon-sm amber">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h5 className="admin-card-title mb-0">New Category</h5>
                    <span className="admin-card-desc">Add to store navigation</span>
                  </div>
                </div>

                <AnimatePresence>
                  {categorySuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="admin-success-banner"
                    >
                      <CheckCircle2 size={16} />
                      <span>Category created successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleCategorySubmit}>
                  <div className="d-flex flex-column gap-3">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Category Name</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Exotic Berries & Melons"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Category Image</label>
                      <select
                        className="admin-form-select"
                        value={newCategory.image}
                        onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      >
                        {availablePresetImages.map((img) => (
                          <option key={img.path} value={img.path}>{img.label}</option>
                        ))}
                      </select>

                      <div className="admin-image-preview mt-3">
                        <div className="halo-circle halo-bg-1 rounded-circle mx-auto position-relative" style={{ width: '72px', height: '72px' }}>
                          <Image
                            src={newCategory.image || '/images/carrots.png'}
                            alt="Category Preview"
                            fill
                            className="object-fit-cover rounded-circle p-1"
                          />
                        </div>
                        <span className="admin-image-preview-label">CATEGORY PREVIEW</span>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Description</label>
                      <textarea
                        rows={3}
                        className="admin-form-textarea"
                        placeholder="Brief summary of this category..."
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="admin-btn-submit mt-4">
                    <Plus size={18} />
                    <span>Add Category</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="admin-card">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h5 className="admin-card-title mb-1">Active Categories</h5>
                    <span className="admin-card-desc">{categories.length} categories in store</span>
                  </div>
                  <span className="admin-badge-count">{categories.length}</span>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Products</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="halo-circle halo-bg-2 rounded-circle position-relative flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                                <Image src={c.image} alt={c.name} fill className="object-fit-cover rounded-circle p-1" />
                              </div>
                              <strong className="admin-product-name">{c.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="admin-cell-text text-truncate d-block" style={{ maxWidth: '200px' }}>{c.description}</span>
                          </td>
                          <td>
                            <span className="admin-badge-count small">{c.productCount} items</span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                onClick={() => deleteCategory(c.id)}
                                className="admin-action-btn delete"
                                title="Delete Category"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
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

        {/* ============================================================= */}
        {/* TAB 3: CUSTOMER ORDERS                                        */}
        {/* ============================================================= */}
        {activeTab === 'orders' && (
          <div className="admin-card">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
              <div>
                <h5 className="admin-card-title mb-1">Customer Orders</h5>
                <span className="admin-card-desc">Track orders, delivery slots and progress.</span>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {(['All', 'Pending', 'Out for Delivery', 'Delivered'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`admin-filter-btn ${orderFilter === filter ? 'active' : ''}`}
                  >
                    {filter === 'All' ? `All (${orders.length})` : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Stats Mini */}
            <div className="row g-3 mb-4">
              {[
                { label: 'Total Orders', value: orders.length, color: '#64748B', bg: '#F1F5F9' },
                { label: 'Pending', value: pendingOrders, color: '#D97706', bg: '#FFFBEB' },
                { label: 'In Transit', value: deliveryOrders, color: '#2563EB', bg: '#EFF6FF' },
                { label: 'Delivered', value: deliveredOrders, color: '#059669', bg: '#ECFDF5' }
              ].map((s, i) => (
                <div className="col-6 col-lg-3" key={i}>
                  <div className="admin-order-mini-stat" style={{ background: s.bg }}>
                    <span className="admin-order-mini-label">{s.label}</span>
                    <strong className="admin-order-mini-value" style={{ color: s.color }}>{s.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Cards */}
            <div className="row g-3 mb-4">
              {visibleOrders.map((order) => (
                <div className="col-12 col-xl-6" key={order.id}>
                  <div className="admin-order-card">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <strong className="font-heading d-block" style={{ fontSize: '0.95rem' }}>{order.name}</strong>
                        <span className="admin-cell-text">{order.phone} · {order.id}</span>
                      </div>
                      <span className={`admin-order-status ${order.status === 'Delivered' ? 'delivered' : order.status === 'Out for Delivery' ? 'transit' : 'pending'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mb-1 mt-3" style={{ fontSize: '0.85rem', color: '#374151' }}>{order.items}</p>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="admin-cell-text">{order.count} items · {order.slot}</span>
                      <strong className="admin-price-current">₹{order.total}</strong>
                    </div>
                    <div className="mt-2 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                      <small className="admin-cell-text">Ordered {order.date}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <div className="mt-2">
              <h6 className="font-heading fw-bold text-dark mb-3">Recent Orders Overview</h6>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Delivery Slot</th>
                      <th>Items</th>
                      <th>Amount</th>
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
                        <td><strong className="font-heading" style={{ fontSize: '0.82rem' }}>{ord.id}</strong></td>
                        <td><span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ord.name}</span></td>
                        <td><span className="admin-cell-text">{ord.slot}</span></td>
                        <td><span className="admin-cell-text">{ord.items}</span></td>
                        <td><strong className="admin-price-current">{ord.total}</strong></td>
                        <td>
                          <span className={`admin-order-status ${ord.status === 'Delivered' ? 'delivered' : ord.status === 'Out for Delivery' ? 'transit' : 'pending'}`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: NOTIFICATIONS                                          */}
        {/* ============================================================= */}
        {activeTab === 'notifications' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-card-icon-sm blue">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h5 className="admin-card-title mb-0">Send Notification</h5>
                    <span className="admin-card-desc">Reach your customers</span>
                  </div>
                </div>

                <AnimatePresence>
                  {notificationSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="admin-success-banner"
                    >
                      <CheckCircle2 size={16} />
                      <span>Notification saved!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={sendNotification}>
                  <div className="d-flex flex-column gap-3">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Audience</label>
                      <select
                        className="admin-form-select"
                        value={notificationDraft.audience}
                        onChange={(e) => setNotificationDraft({ ...notificationDraft, audience: e.target.value })}
                      >
                        <option>All customers</option>
                        <option>Active customers</option>
                        <option>New customers</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Title</label>
                      <input
                        required
                        className="admin-form-input"
                        placeholder="e.g. Fresh mangoes are here!"
                        value={notificationDraft.title}
                        onChange={(e) => setNotificationDraft({ ...notificationDraft, title: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Message</label>
                      <textarea
                        required
                        rows={4}
                        className="admin-form-textarea"
                        placeholder="Write your customer update..."
                        value={notificationDraft.message}
                        onChange={(e) => setNotificationDraft({ ...notificationDraft, message: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="admin-btn-submit mt-4">
                    <Bell size={16} />
                    <span>Send Notification</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="admin-card" style={{ minHeight: '400px' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h5 className="admin-card-title mb-1">Notification History</h5>
                    <span className="admin-card-desc">{notifications.length} saved notification{notifications.length === 1 ? '' : 's'}</span>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <Bell size={36} className="mb-3" style={{ color: '#D1D5DB' }} />
                    <p className="mb-0 admin-cell-text">No notifications created yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="admin-notification-item">
                        <div className="d-flex justify-content-between gap-3">
                          <strong style={{ fontSize: '0.9rem' }}>{notification.title}</strong>
                          <span className="admin-badge-count small">{notification.audience}</span>
                        </div>
                        <p className="admin-cell-text mb-2 mt-2">{notification.message}</p>
                        <small className="admin-cell-text">Saved {notification.sentAt}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 5: SYSTEM MANAGEMENT                                      */}
        {/* ============================================================= */}
        {activeTab === 'system' && (
          <div className="row g-4">
            {[
              { icon: ShieldAlert, title: 'Access Management', desc: 'All signed-in users have Super Admin workspace access in the current frontend setup.', badge: 'Enabled', badgeClass: 'green' },
              { icon: Store, title: 'Store Data', desc: 'Products, categories and notification drafts are stored locally in this browser.', badge: 'Local', badgeClass: 'amber', link: '/' },
              { icon: Activity, title: 'Backend Status', desc: 'Backend configuration is available separately. Marketplace API runs on port 5000.', badge: 'Connected', badgeClass: 'green' }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div className="col-md-6 col-xl-4" key={i}>
                  <div className="admin-card h-100">
                    <div className="admin-system-icon mb-3">
                      <Icon size={24} />
                    </div>
                    <h5 className="font-heading fw-bold mb-2" style={{ fontSize: '1rem' }}>{card.title}</h5>
                    <p className="admin-cell-text mb-3">{card.desc}</p>
                    <span className={`admin-system-badge ${card.badgeClass}`}>{card.badge}</span>
                    {card.link && (
                      <Link href={card.link} className="admin-link-btn mt-3">
                        Open storefront <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================= */}
        {/* Product Detail Modal                                          */}
        {/* ============================================================= */}
        <AnimatePresence>
          {viewingProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="admin-modal-overlay"
              onClick={() => setViewingProduct(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="admin-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative rounded-4 bg-light" style={{ width: '80px', height: '80px' }}>
                      <Image src={viewingProduct.image} alt={viewingProduct.name} fill className="object-fit-contain p-2" />
                    </div>
                    <div>
                      <span className="admin-badge-count small mb-1 d-inline-block">{viewingProduct.category}</span>
                      <h4 className="font-heading fw-bold mb-1" style={{ fontSize: '1.15rem' }}>{viewingProduct.name}</h4>
                      <div className="d-flex align-items-center gap-2">
                        <strong className="admin-price-current" style={{ fontSize: '1.05rem' }}>₹{viewingProduct.price}</strong>
                        <span className="admin-price-original">₹{viewingProduct.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setViewingProduct(null)} className="admin-modal-close">
                    <X size={18} />
                  </button>
                </div>

                <p className="admin-cell-text mb-4">{viewingProduct.description}</p>

                <div className="row g-3">
                  {[
                    { label: 'Availability', value: viewingProduct.inStock ? 'In stock' : 'Out of stock' },
                    { label: 'Store Status', value: viewingProduct.isAdded !== false ? 'Live on store' : 'Hidden' },
                    { label: 'Rating', value: `${viewingProduct.rating}/5 (${viewingProduct.reviewsCount} reviews)` },
                    { label: 'Sizes', value: viewingProduct.weights.join(', ') },
                    { label: 'Origin', value: viewingProduct.nutrition.origin },
                    { label: 'Best Before', value: viewingProduct.nutrition.bestBefore }
                  ].map((item, idx) => (
                    <div className="col-6 col-md-4" key={idx}>
                      <div className="admin-detail-cell">
                        <span className="admin-detail-label">{item.label}</span>
                        <span className="admin-detail-value">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
