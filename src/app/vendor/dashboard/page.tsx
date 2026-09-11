'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { catalogApi } from '@/services/api';
import { 
  Store, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw,
  Sliders,
  Building,
  User,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Boxes,
  X
} from 'lucide-react';

interface VendorProduct {
  id: string;
  name: string;
  type: 'Vegetable' | 'Fruit';
  category: string;
  price: number;
  unit: string;
  stock: number;
  soldQuantity: number;
  totalRevenue: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface VendorOrder {
  id: string;
  customerName: string;
  itemsCount: number;
  totalAmount: number;
  deliverySlot: string;
  status: 'Pending' | 'Packaging' | 'Dispatched' | 'Delivered';
  createdAt: string;
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'payouts'>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState<'Vegetable' | 'Fruit'>('Vegetable');
  const [newProdCategory, setNewProdCategory] = useState('Leafy Greens');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdStock, setNewProdStock] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Produce type filter ('all' | 'Vegetable' | 'Fruit')
  const [produceFilter, setProduceFilter] = useState<'all' | 'Vegetable' | 'Fruit'>('all');

  // Vendor product state (only this vendor's produce items)
  const [products, setProducts] = useState<VendorProduct[]>([
    { id: 'vp-1', name: 'Fresh Organic Spinach (Palak)', type: 'Vegetable', category: 'Leafy Greens', price: 45, unit: 'kg', stock: 120, soldQuantity: 310, totalRevenue: 13950, status: 'In Stock' },
    { id: 'vp-2', name: 'Farm Fresh Tomatoes (Tomato)', type: 'Vegetable', category: 'Vegetables', price: 38, unit: 'kg', stock: 15, soldQuantity: 280, totalRevenue: 10640, status: 'Low Stock' },
    { id: 'vp-3', name: 'Royal Gala Red Apples', type: 'Fruit', category: 'Organic Fruits', price: 140, unit: 'kg', stock: 85, soldQuantity: 450, totalRevenue: 63000, status: 'In Stock' },
    { id: 'vp-4', name: 'Organic Alphonso Mangoes', type: 'Fruit', category: 'Seasonal Fruits', price: 240, unit: 'kg', stock: 0, soldQuantity: 380, totalRevenue: 91200, status: 'Out of Stock' },
    { id: 'vp-5', name: 'Fresh Green Capsicum', type: 'Vegetable', category: 'Vegetables', price: 75, unit: 'kg', stock: 40, soldQuantity: 110, totalRevenue: 8250, status: 'In Stock' },
    { id: 'vp-6', name: 'Robusta Tree-Ripened Bananas', type: 'Fruit', category: 'Organic Fruits', price: 50, unit: 'kg', stock: 95, soldQuantity: 520, totalRevenue: 26000, status: 'In Stock' },
  ]);

  // Vendor order state
  const [orders, setOrders] = useState<VendorOrder[]>([
    { id: 'ORD-9841', customerName: 'Rohan Sharma', itemsCount: 4, totalAmount: 380, deliverySlot: 'Today, 4 PM - 6 PM', status: 'Pending', createdAt: '10 mins ago' },
    { id: 'ORD-9839', customerName: 'Priya Verma', itemsCount: 2, totalAmount: 195, deliverySlot: 'Today, 6 PM - 8 PM', status: 'Packaging', createdAt: '35 mins ago' },
    { id: 'ORD-9835', customerName: 'Anand Patel', itemsCount: 6, totalAmount: 820, deliverySlot: 'Tomorrow, 7 AM - 9 AM', status: 'Dispatched', createdAt: '2 hours ago' },
    { id: 'ORD-9820', customerName: 'Sunita Rao', itemsCount: 3, totalAmount: 410, deliverySlot: 'Yesterday', status: 'Delivered', createdAt: 'Yesterday' },
  ]);

  // Strict Vendor Guard checking
  const isVendor = isLoggedIn && user && (
    String(user.role || '').toLowerCase().includes('vendor') ||
    String(user.email || '').toLowerCase().includes('vendor')
  );

  useEffect(() => {
    if (!loading && !isVendor) {
      router.replace('/vendor/login');
    }
  }, [isVendor, loading, router]);

  if (loading || !isVendor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1329', color: '#ffffff' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" style={{ color: '#10b981', width: '3rem', height: '3rem' }}></div>
          <p className="fw-semibold" style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>Authenticating Vendor Account...</p>
        </div>
      </div>
    );
  }

  const handleStockUpdate = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock < 25 ? 'Low Stock' : 'In Stock',
          };
        }
        return p;
      })
    );
  };

  const handleOrderStatusChange = (orderId: string, newStatus: VendorOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) {
      alert('Please fill in all required product fields.');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    const stockNum = parseInt(newProdStock, 10);

    const newProduct: VendorProduct = {
      id: `vp-${Date.now()}`,
      name: newProdName.trim(),
      type: newProdType,
      category: newProdCategory,
      price: priceNum,
      unit: newProdUnit,
      stock: stockNum,
      soldQuantity: 0,
      totalRevenue: 0,
      status: stockNum === 0 ? 'Out of Stock' : stockNum < 25 ? 'Low Stock' : 'In Stock',
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Async attempt backend catalog creation
    catalogApi.createProduct({
      name: newProduct.name,
      type: newProduct.type,
      category: newProduct.category,
      price: newProduct.price,
      stock: newProduct.stock
    }).catch(() => null);

    setToastMsg(`"${newProduct.name}" (${newProduct.type}) added to catalog successfully!`);
    setTimeout(() => setToastMsg(null), 4000);

    // Reset form & close modal
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
    setIsAddModalOpen(false);
  };

  const filteredOrders = orders.filter((o) => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = produceFilter === 'all' || p.type === produceFilter;
    return matchesSearch && matchesType;
  });

  // Calculate Vendor Specific Performance Metrics
  const totalSoldUnits = products.reduce((acc, p) => acc + p.soldQuantity, 0);
  const totalRevenueGenerated = products.reduce((acc, p) => acc + p.totalRevenue, 0);
  const totalRemainingStock = products.reduce((acc, p) => acc + p.stock, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Packaging').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const vegCount = products.filter((p) => p.type === 'Vegetable').length;
  const fruitCount = products.filter((p) => p.type === 'Fruit').length;

  const cellDarkStyle: React.CSSProperties = {
    backgroundColor: '#111c38',
    color: '#f8fafc',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  };

  const thDarkStyle: React.CSSProperties = {
    backgroundColor: '#0b1329',
    color: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    fontSize: '0.775rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b1329',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '14px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          zIndex: 150,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <header style={{
        backgroundColor: '#111c38',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.9rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div className="container-fluid d-flex align-items-center justify-content-between" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          
          {/* Left Brand info */}
          <div className="d-flex align-items-center gap-3">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}>
              <Store size={24} color="#ffffff" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white" style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                  {user?.name || 'Organic Farm Fresh Co.'}
                </span>
                <span className="badge rounded-pill px-2.5 py-1" style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.725rem',
                  fontWeight: 700
                }}>
                  <ShieldCheck size={13} className="me-1" style={{ verticalAlign: '-1px' }} />
                  Verified Vendor
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Seller Portal &bull; {user?.email}
              </div>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="d-none d-md-block" style={{ width: '360px' }}>
            <div className="position-relative">
              <Search size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, SKU, customer name..."
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.6rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '0.85rem',
                borderRadius: '50px',
                padding: '0.45rem 1.1rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              <Plus size={16} />
              <span>Add Produce</span>
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontSize: '0.85rem',
                borderRadius: '50px',
                padding: '0.45rem 1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <Store size={15} color="#34d399" />
              <span>Customer Store</span>
            </button>

            <button
              onClick={() => logout()}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.85rem',
                borderRadius: '50px',
                padding: '0.45rem 1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)')}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Metric Cards Banner */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div style={{
              background: 'linear-gradient(135deg, #111c38 0%, #0b1329 100%)',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Kita Bika (Sales Earned)</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={22} color="#34d399" />
                </div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between">
                <h2 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '-0.02em' }}>₹{totalRevenueGenerated.toLocaleString()}</h2>
                <span className="badge px-2 py-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem' }}>
                  {totalSoldUnits} kg/pcs Sold
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div style={{
              background: 'linear-gradient(135deg, #111c38 0%, #0b1329 100%)',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Kita Nahi Bika (Stock)</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Boxes size={22} color="#60a5fa" />
                </div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between">
                <h2 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '-0.02em' }}>{totalRemainingStock} kg/pcs</h2>
                <span className="badge px-2 py-1" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.75rem' }}>
                  {products.length} Items Listed
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div style={{
              background: 'linear-gradient(135deg, #111c38 0%, #0b1329 100%)',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Kite Pending (Dispatch)</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} color="#fbbf24" />
                </div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between">
                <h2 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '-0.02em' }}>{pendingOrdersCount} Orders</h2>
                <span className="badge px-2 py-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem' }}>
                  Action Needed
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div style={{
              background: 'linear-gradient(135deg, #111c38 0%, #0b1329 100%)',
              borderRadius: '20px',
              padding: '1.35rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Produce Categories</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={22} color="#c084fc" />
                </div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between">
                <h2 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '-0.02em' }}>{vegCount} Veg / {fruitCount} Fruit</h2>
                <span className="badge px-2 py-1" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '0.75rem' }}>
                  {deliveredOrdersCount} Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="d-flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.7rem 1.35rem',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: activeTab === 'orders' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'orders' ? '#ffffff' : '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'orders' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
              }}
            >
              <Package size={18} />
              <span>Live Customer Orders</span>
              <span className="badge rounded-pill" style={{ backgroundColor: activeTab === 'orders' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                padding: '0.7rem 1.35rem',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: activeTab === 'inventory' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'inventory' ? '#ffffff' : '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'inventory' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
              }}
            >
              <Boxes size={18} />
              <span>Products & Inventory</span>
              <span className="badge rounded-pill" style={{ backgroundColor: activeTab === 'inventory' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              style={{
                padding: '0.7rem 1.35rem',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: activeTab === 'payouts' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'payouts' ? '#ffffff' : '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'payouts' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
              }}
            >
              <DollarSign size={18} />
              <span>Payouts & Bank Settlement</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              padding: '0.6rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
          >
            <Plus size={18} />
            <span>Add New Produce / Crop</span>
          </button>
        </div>

        {/* SECTION 1: LIVE ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: '#111c38',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }}>
            {/* Table Top Header */}
            <div className="p-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#162244', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div>
                <h4 className="fw-extrabold mb-1 text-white" style={{ letterSpacing: '-0.02em' }}>Live Customer Orders</h4>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Fulfill and pack incoming grocery orders for fast delivery</p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>Live Auto-Sync Active</span>
                </div>
                <button
                  onClick={() => alert('Orders refreshed successfully!')}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* High-Contrast Dark Order Table */}
            <div className="table-responsive">
              <table style={{ width: '100%', backgroundColor: '#111c38', borderCollapse: 'collapse', color: '#f8fafc' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0b1329', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <th className="py-3.5 ps-4" style={thDarkStyle}>Order ID</th>
                    <th className="py-3.5" style={thDarkStyle}>Customer Name</th>
                    <th className="py-3.5" style={thDarkStyle}>Quantity</th>
                    <th className="py-3.5" style={thDarkStyle}>Delivery Slot</th>
                    <th className="py-3.5" style={thDarkStyle}>Amount</th>
                    <th className="py-3.5" style={thDarkStyle}>Order Status</th>
                    <th className="py-3.5 pe-4 text-end" style={thDarkStyle}>Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#111c38' }}>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      {/* Order ID */}
                      <td className="ps-4 py-3.5" style={cellDarkStyle}>
                        <span style={{
                          color: '#34d399',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          letterSpacing: '0.02em',
                          fontFamily: 'monospace'
                        }}>
                          {ord.id}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5" style={cellDarkStyle}>
                        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>
                          {ord.customerName}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.775rem' }}>
                          Received {ord.createdAt}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5" style={cellDarkStyle}>
                        <span style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#f8fafc',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'inline-block'
                        }}>
                          {ord.itemsCount} items
                        </span>
                      </td>

                      {/* Delivery Slot Badge - HIGH CONTRAST DARK PILL */}
                      <td className="py-3.5" style={cellDarkStyle}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.825rem',
                          fontWeight: 700
                        }}>
                          <Clock size={14} color="#34d399" />
                          <span>{ord.deliverySlot}</span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5" style={cellDarkStyle}>
                        <span style={{ color: '#34d399', fontWeight: 800, fontSize: '1.05rem' }}>
                          ₹{ord.totalAmount}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5" style={cellDarkStyle}>
                        {ord.status === 'Pending' && (
                          <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.5)', fontSize: '0.8rem', fontWeight: 700 }}>
                            Pending
                          </span>
                        )}
                        {ord.status === 'Packaging' && (
                          <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.5)', fontSize: '0.8rem', fontWeight: 700 }}>
                            Packaging
                          </span>
                        )}
                        {ord.status === 'Dispatched' && (
                          <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.5)', fontSize: '0.8rem', fontWeight: 700 }}>
                            Dispatched
                          </span>
                        )}
                        {ord.status === 'Delivered' && (
                          <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.5)', fontSize: '0.8rem', fontWeight: 700 }}>
                            Delivered
                          </span>
                        )}
                      </td>

                      {/* Fulfillment Action */}
                      <td className="pe-4 py-3.5 text-end" style={cellDarkStyle}>
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleOrderStatusChange(ord.id, 'Packaging')}
                            style={{
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              color: '#ffffff',
                              fontWeight: 700,
                              border: 'none',
                              padding: '0.45rem 1.1rem',
                              borderRadius: '50px',
                              fontSize: '0.825rem',
                              boxShadow: '0 3px 10px rgba(245, 158, 11, 0.35)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
                          >
                            Mark Ready to Pack
                          </button>
                        )}
                        {ord.status === 'Packaging' && (
                          <button
                            onClick={() => handleOrderStatusChange(ord.id, 'Dispatched')}
                            style={{
                              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                              color: '#ffffff',
                              fontWeight: 700,
                              border: 'none',
                              padding: '0.45rem 1.1rem',
                              borderRadius: '50px',
                              fontSize: '0.825rem',
                              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.35)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
                          >
                            Dispatch to Darkstore
                          </button>
                        )}
                        {ord.status === 'Dispatched' && (
                          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }} className="d-inline-flex align-items-center gap-1">
                            <CheckCircle size={15} />
                            <span>Out for Delivery</span>
                          </span>
                        )}
                        {ord.status === 'Delivered' && (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: PRODUCTS & INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div style={{
            backgroundColor: '#111c38',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }}>
            <div className="p-4 d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ backgroundColor: '#162244', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div>
                <h4 className="fw-extrabold mb-1 text-white" style={{ letterSpacing: '-0.02em' }}>Vendor Inventory & Produce Catalog</h4>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Manage stock levels, price per kg, and view sold vs remaining stock</p>
              </div>

              {/* Vegetables vs Fruits Filter Pill Buttons */}
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => setProduceFilter('all')}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: produceFilter === 'all' ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  All Produce ({products.length})
                </button>
                <button
                  onClick={() => setProduceFilter('Vegetable')}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: produceFilter === 'Vegetable' ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🥦 Vegetables ({vegCount})
                </button>
                <button
                  onClick={() => setProduceFilter('Fruit')}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: produceFilter === 'Fruit' ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🍎 Fruits ({fruitCount})
                </button>
              </div>

              <div style={{ width: '280px' }} className="position-relative">
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter crop or produce..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 2.4rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', backgroundColor: '#111c38', borderCollapse: 'collapse', color: '#f8fafc' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0b1329', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <th className="py-3.5 ps-4" style={thDarkStyle}>Produce Name</th>
                    <th className="py-3.5" style={thDarkStyle}>Type & Category</th>
                    <th className="py-3.5" style={thDarkStyle}>Price / Unit</th>
                    <th className="py-3.5" style={thDarkStyle}>Kita Nahi Bika (Stock)</th>
                    <th className="py-3.5" style={thDarkStyle}>Kita Bika (Sold)</th>
                    <th className="py-3.5" style={thDarkStyle}>Revenue Earned</th>
                    <th className="py-3.5" style={thDarkStyle}>Status</th>
                    <th className="py-3.5 pe-4 text-end" style={thDarkStyle}>Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#111c38' }}>
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <td className="ps-4 py-3.5 fw-bold text-white" style={{ ...cellDarkStyle, fontSize: '0.95rem' }}>{prod.name}</td>
                      <td className="py-3.5" style={cellDarkStyle}>
                        <div className="d-flex align-items-center gap-1.5">
                          <span className="badge px-2 py-1" style={{ backgroundColor: prod.type === 'Vegetable' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: prod.type === 'Vegetable' ? '#34d399' : '#fb7185', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 700 }}>
                            {prod.type === 'Vegetable' ? '🥦 Veg' : '🍎 Fruit'}
                          </span>
                          <span className="badge px-2 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.75rem' }}>
                            {prod.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 fw-bold" style={{ ...cellDarkStyle, color: '#34d399', fontSize: '0.95rem' }}>
                        ₹{prod.price} / {prod.unit}
                      </td>
                      <td className="py-3.5" style={cellDarkStyle}>
                        <span className="fw-extrabold" style={{ color: prod.stock === 0 ? '#ef4444' : prod.stock < 25 ? '#f59e0b' : '#ffffff', fontSize: '0.95rem' }}>
                          {prod.stock} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3.5" style={cellDarkStyle}>
                        <span className="fw-extrabold text-info" style={{ color: '#38bdf8', fontSize: '0.95rem' }}>
                          {prod.soldQuantity} {prod.unit}
                        </span>
                      </td>
                      <td className="py-3.5 fw-bold" style={{ ...cellDarkStyle, color: '#34d399', fontSize: '0.95rem' }}>
                        ₹{prod.totalRevenue.toLocaleString()}
                      </td>
                      <td className="py-3.5" style={cellDarkStyle}>
                        {prod.status === 'In Stock' && (
                          <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700 }}>
                            In Stock
                          </span>
                        )}
                        {prod.status === 'Low Stock' && (
                          <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 700 }}>
                            Low Stock
                          </span>
                        )}
                        {prod.status === 'Out of Stock' && (
                          <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 700 }}>
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="pe-4 py-3.5 text-end" style={cellDarkStyle}>
                        <div className="d-inline-flex gap-2">
                          <button
                            onClick={() => handleStockUpdate(prod.id, -10)}
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.18)',
                              color: '#fca5a5',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.35)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)')}
                          >
                            -10 {prod.unit}
                          </button>
                          <button
                            onClick={() => handleStockUpdate(prod.id, +20)}
                            style={{
                              backgroundColor: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.85rem',
                              cursor: 'pointer',
                              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                          >
                            +20 {prod.unit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: PAYOUTS & BANK SETTLEMENT TAB */}
        {activeTab === 'payouts' && (
          <div className="row g-4">
            <div className="col-md-7">
              <div style={{
                backgroundColor: '#111c38',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '1.75rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}>
                <h4 className="fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Automated Bank Settlement</h4>
                <div className="p-4 mb-4 rounded-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Connected Settlement Bank Account</span>
                    <span className="badge px-2.5 py-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>Verified Active</span>
                  </div>
                  <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>HDFC Bank Ltd - Account ending in **9412</div>
                  <div className="text-muted extra-small mt-1">IFSC: HDFC0001824 | Branch: Sector 62 Dark Store Hub</div>
                </div>

                <h5 className="fw-bold text-white mt-4 mb-3">Recent Payout Disbursals</h5>
                <div className="list-group list-group-flush bg-transparent">
                  <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <div className="fw-bold text-white" style={{ fontSize: '0.95rem' }}>Daily Settlement #PAY-9912</div>
                      <div className="text-muted extra-small">Processed Yesterday at 11:59 PM</div>
                    </div>
                    <span className="fw-extrabold text-success" style={{ fontSize: '1.1rem', color: '#34d399' }}>+ ₹28,450.00</span>
                  </div>
                  <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <div className="fw-bold text-white" style={{ fontSize: '0.95rem' }}>Daily Settlement #PAY-9908</div>
                      <div className="text-muted extra-small">Processed 9th Sep at 11:59 PM</div>
                    </div>
                    <span className="fw-extrabold text-success" style={{ fontSize: '1.1rem', color: '#34d399' }}>+ ₹31,200.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div style={{
                backgroundColor: '#111c38',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '1.75rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}>
                <h4 className="fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Partner SLA & Support</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Need assistance with cold-store logistics, return claims, or GST invoice statements?</p>
                
                <button
                  onClick={() => alert('Dedicated Vendor Manager will contact you on WhatsApp in 15 minutes.')}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    marginBottom: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                >
                  <User size={18} color="#34d399" />
                  <span>Contact Account Manager</span>
                </button>

                <button
                  onClick={() => alert('Downloading GST Sales Report PDF...')}
                  style={{
                    width: '100%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  <ArrowUpRight size={18} />
                  <span>Download GST Tax Statement</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ADD PRODUCE / CROP MODAL DIALOG */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#111c38',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div className="p-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#162244', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={22} color="#34d399" />
                </div>
                <h5 className="fw-extrabold mb-0 text-white" style={{ letterSpacing: '-0.01em' }}>Add New Produce / Crop</h5>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProductSubmit} className="p-4">
              
              {/* Produce Type Selector (Vegetable vs Fruit) */}
              <div className="mb-3">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
                  Select Produce Type
                </label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewProdType('Vegetable');
                      setNewProdCategory('Leafy Greens');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '12px',
                      border: newProdType === 'Vegetable' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: newProdType === 'Vegetable' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: newProdType === 'Vegetable' ? '#34d399' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    🥦 Vegetable
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProdType('Fruit');
                      setNewProdCategory('Organic Fruits');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '12px',
                      border: newProdType === 'Fruit' ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: newProdType === 'Fruit' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: newProdType === 'Fruit' ? '#fb7185' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    🍎 Fruit
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem', display: 'block' }}>
                  Produce / Crop Name
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder={newProdType === 'Vegetable' ? "e.g. Organic Farm Fresh Spinach (Palak)" : "e.g. Royal Gala Red Apples"}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem', display: 'block' }}>
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    {newProdType === 'Vegetable' ? (
                      <>
                        <option value="Leafy Greens">Leafy Greens</option>
                        <option value="Vegetables">Fresh Vegetables</option>
                        <option value="Root Vegetables">Root Vegetables</option>
                        <option value="Organic Vegetables">Organic Vegetables</option>
                        <option value="Salad Vegetables">Salad Vegetables</option>
                        <option value="Exotic Veggies">Exotic Veggies</option>
                      </>
                    ) : (
                      <>
                        <option value="Organic Fruits">Organic Fruits</option>
                        <option value="Citrus & Berries">Citrus & Berries</option>
                        <option value="Exotic Fruits">Exotic Fruits</option>
                        <option value="Seasonal Fruits">Seasonal Fruits</option>
                        <option value="Tropical Fruits">Tropical Fruits</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="col-6">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem', display: 'block' }}>
                    Weight Unit
                  </label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="kg">kg</option>
                    <option value="500g">500g</option>
                    <option value="250g">250g</option>
                    <option value="bunch">bunch</option>
                    <option value="pack">pack</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem', display: 'block' }}>
                    Price per {newProdUnit} (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 45"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="col-6">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem', display: 'block' }}>
                    Initial Batch Stock ({newProdUnit})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="e.g. 100"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#cbd5e1',
                    fontWeight: 600,
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Save & Publish Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
