'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Order, OrderStatus } from '@/types';
import { ordersApi } from '@/services/api';
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Package,
  RotateCcw,
  Printer,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
  Zap,
  UserCheck,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'FV-88401',
    createdAt: 'Today, 10:24 AM',
    status: 'Out for Delivery',
    items: [
      { id: '1', name: 'Fresh Organic Carrot', weight: '1kg', price: 60, quantity: 2, image: '/images/carrots.png' },
      { id: '3', name: 'Green Tender Broccoli', weight: '500g', price: 40, quantity: 1, image: '/images/broccoli.png' },
      { id: '5', name: 'Fresh Baby Spinach', weight: '250g', price: 30, quantity: 2, image: '/images/spinach.png' }
    ],
    itemCount: 5,
    totalAmount: 220,
    discountAmount: 40,
    couponCode: 'FRESH100',
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Paid',
    address: {
      fullName: 'Aarav Sharma',
      mobile: '+91 98765 43210',
      email: 'aarav@example.com',
      address: 'Flat 402, Green Acres Apartment, HSR Layout',
      landmark: 'Near BDA Complex',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102'
    },
    deliverySlot: {
      date: 'Today',
      timeSlot: 'Express',
      slotTimeText: '15-30 Mins Express Delivery',
      isExpress: true
    },
    deliveryTimeText: 'Today · Arriving in 15 mins (Slot: 10:30 AM - 11:00 AM)'
  },
  {
    id: 'ord-1002',
    orderNumber: 'FV-88350',
    createdAt: 'Yesterday, 04:15 PM',
    status: 'Delivered',
    items: [
      { id: '7', name: 'Organic Royal Crisp Apple', weight: '1kg', price: 140, quantity: 1, image: '/images/apple.png' },
      { id: '8', name: 'Sweet Golden Banana', weight: '1kg', price: 45, quantity: 2, image: '/images/banana.png' }
    ],
    itemCount: 3,
    totalAmount: 230,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'COD',
    address: {
      fullName: 'Aarav Sharma',
      mobile: '+91 98765 43210',
      email: 'aarav@example.com',
      address: 'Flat 402, Green Acres Apartment, HSR Layout',
      landmark: 'Near BDA Complex',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102'
    },
    deliverySlot: {
      date: 'Yesterday',
      timeSlot: 'Evening',
      slotTimeText: '5:00 PM - 8:00 PM'
    },
    deliveryTimeText: 'Yesterday · Delivered at 5:45 PM'
  },
  {
    id: 'ord-1003',
    orderNumber: 'FV-87910',
    createdAt: '28 Aug 2026, 11:30 AM',
    status: 'Delivered',
    items: [
      { id: '2', name: 'Red Farm Tomato', weight: '1kg', price: 35, quantity: 2, image: '/images/tomatoes.png' },
      { id: '4', name: 'Organic Potato Special', weight: '2kg', price: 50, quantity: 1, image: '/images/potatoes.png' }
    ],
    itemCount: 3,
    totalAmount: 120,
    discountAmount: 20,
    couponCode: 'ORGANIC20',
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    address: {
      fullName: 'Aarav Sharma',
      mobile: '+91 98765 43210',
      email: 'aarav@example.com',
      address: 'Flat 402, Green Acres Apartment, HSR Layout',
      landmark: 'Near BDA Complex',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102'
    },
    deliverySlot: {
      date: '28 Aug 2026',
      timeSlot: 'Morning',
      slotTimeText: '8:00 AM - 11:00 AM'
    },
    deliveryTimeText: '28 Aug 2026 · Delivered at 10:15 AM'
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'delivered'>('all');
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);
  const [reviewModalItem, setReviewModalItem] = useState<{ id: string; name: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      const apiRes = await ordersApi.getCustomerOrders();
      let baseOrders: Order[] = MOCK_ORDERS;

      if (apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        baseOrders = apiRes.data;
      } else {
        const saved = localStorage.getItem('freshvana_customer_orders');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const combined = [...parsed];
              MOCK_ORDERS.forEach((m) => {
                if (!combined.some((c) => c.orderNumber === m.orderNumber)) {
                  combined.push(m);
                }
              });
              baseOrders = combined;
            }
          } catch (err) {
            console.error('Error loading saved orders:', err);
          }
        }
      }

      setOrders(baseOrders);
      setSelectedOrder(baseOrders[0] || null);
    };

    fetchCustomerOrders();
  }, []);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const mockProduct: any = {
        id: item.id,
        name: item.name,
        category: 'Fresh Vegetables',
        categoryId: 'veggies',
        price: item.price,
        originalPrice: Math.round(item.price * 1.25),
        discountPercentage: 20,
        rating: 4.9,
        reviewsCount: 38,
        badge: 'Organic',
        inStock: true,
        image: item.image || '/images/carrots.png',
        thumbnails: [item.image || '/images/carrots.png'],
        description: 'Fresh organic produce reordered.',
        weights: [item.weight || '1kg'],
        healthBenefits: [],
        nutrition: {
          calories: '45 kcal',
          protein: '1g',
          fiber: '2g',
          carbs: '8g',
          vitaminA: '100%',
          vitaminC: '40%',
          iron: '5%',
          storage: 'Refrigerate',
          howToConsume: 'Enjoy fresh',
          origin: 'Local Farm',
          bestBefore: '7 Days'
        },
        reviews: []
      };
      addToCart(mockProduct, item.weight || '1kg', item.quantity);
    });

    setReorderSuccess(order.orderNumber);
    setTimeout(() => setReorderSuccess(null), 3500);
    setIsCartOpen(true);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Order Confirmed':
        return 0;
      case 'Harvested & Packed':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'active') {
      return ord.status !== 'Delivered' && ord.status !== 'Cancelled';
    }
    if (filterStatus === 'delivered') {
      return ord.status === 'Delivered';
    }
    return true;
  });

  const sendWhatsAppHelp = (orderNumber: string) => {
    const text = encodeURIComponent(
      `Hi FreshVana Support! I need assistance with my Order #${orderNumber}. Please help me.`
    );
    window.open(`https://api.whatsapp.com/send?phone=918707375679&text=${text}`, '_blank');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalItem(null);
      setReviewText('');
    }, 2000);
  };

  return (
    <div className="min-vh-100 bg-cream py-4 py-md-5" style={{ paddingTop: '150px' }}>
      <div className="container">
        {/* Top Header & Navigation */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <Link
              href="/account"
              className="btn btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center shadow-xs"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="font-heading fs-3 fw-extrabold text-dark mb-0">My Orders & Live Tracking</h1>
                <span className="badge bg-success text-white rounded-pill px-2.5 py-1 small fw-bold">
                  Flipkart / Zepto Real-time Tracking
                </span>
              </div>
              <p className="text-muted small mb-0">Track active express deliveries, view invoices, and reorder fresh harvest</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              href="/shop"
              className="btn btn-success rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
              style={{ background: '#0A6836' }}
            >
              <ShoppingBag size={16} />
              <span>Order Fresh Produce</span>
            </Link>
          </div>
        </div>

        {/* Reorder Toast Banner */}
        <AnimatePresence>
          {reorderSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="alert alert-success rounded-4 border-0 shadow-sm d-flex align-items-center justify-content-between mb-4 p-3"
            >
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 size={20} className="text-success" />
                <span className="fw-bold">All items from Order #{reorderSuccess} added to your Cart!</span>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn btn-sm btn-success rounded-pill px-3 fw-bold"
              >
                Open Cart Basket
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-4 border p-3 mb-4 shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-md-6 col-lg-7">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 ps-3 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by Order ID (e.g. FV-88401) or Product name (Carrot, Apple)..."
                  className="form-control bg-light border-start-0 py-2 small shadow-none text-dark"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 col-lg-5">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <Filter size={16} className="text-muted d-none d-sm-inline" />
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${
                    filterStatus === 'all' ? 'btn-success text-white' : 'btn-light border text-dark'
                  }`}
                  style={filterStatus === 'all' ? { background: '#0A6836' } : {}}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('active')}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${
                    filterStatus === 'active' ? 'btn-warning text-dark' : 'btn-light border text-dark'
                  }`}
                >
                  On the Way 🚚 ({orders.filter((o) => o.status !== 'Delivered').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('delivered')}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${
                    filterStatus === 'delivered' ? 'btn-success text-white' : 'btn-light border text-dark'
                  }`}
                >
                  Delivered ✅ ({orders.filter((o) => o.status === 'Delivered').length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Orders Content Grid */}
        <div className="row g-4">
          {/* Left Column: Orders List */}
          <div className="col-lg-5 col-xl-4">
            <div className="d-flex flex-column gap-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-4">
                  <Package size={40} className="text-muted mb-2 opacity-50" />
                  <h6 className="fw-bold text-dark mb-1">No Orders Found</h6>
                  <p className="text-muted small">No order matches your current search or filter query.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                    }}
                    className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  const isDelivered = ord.status === 'Delivered';
                  const isExpress = ord.deliverySlot?.isExpress;

                  return (
                    <motion.div
                      key={ord.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedOrder(ord)}
                      className={`card border-0 rounded-4 shadow-sm p-3 cursor-pointer transition-all ${
                        isSelected ? 'border-2 border-success bg-white shadow-md' : 'bg-white'
                      }`}
                      style={{
                        borderLeft: isSelected ? '5px solid #0A6836' : '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark fs-6 font-heading">#{ord.orderNumber}</span>
                          {isExpress && (
                            <span
                              className="badge rounded-pill bg-danger text-white d-flex align-items-center gap-1"
                              style={{ fontSize: '0.62rem' }}
                            >
                              <Zap size={10} /> 15 MINS
                            </span>
                          )}
                        </div>
                        <span
                          className={`badge rounded-pill px-2.5 py-1 fw-bold ${
                            isDelivered
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : 'bg-warning-subtle text-dark border border-warning-subtle animate-pulse'
                          }`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
                        <Calendar size={13} />
                        <span>{ord.createdAt}</span>
                        <span>·</span>
                        <span>{ord.items.length} produce item(s)</span>
                      </div>

                      {/* Order Item Thumbnails */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        {ord.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="position-relative bg-light rounded-3 p-1 flex-shrink-0"
                            style={{ width: '44px', height: '44px', border: '1px solid #E2E8F0' }}
                          >
                            <Image
                              src={item.image || '/images/carrots.png'}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-fit-contain p-1"
                            />
                          </div>
                        ))}
                        {ord.items.length > 3 && (
                          <div
                            className="bg-light rounded-3 d-flex align-items-center justify-content-center fw-bold text-muted small"
                            style={{ width: '44px', height: '44px', border: '1px solid #E2E8F0' }}
                          >
                            +{ord.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                        <div>
                          <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                            Total Paid
                          </span>
                          <strong className="text-success font-heading fs-6">₹{ord.totalAmount}</strong>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(ord);
                          }}
                          className="btn btn-sm btn-light border rounded-pill px-3 fw-bold text-dark d-flex align-items-center gap-1"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <RotateCcw size={13} className="text-success" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Order View */}
          <div className="col-lg-7 col-xl-8">
            {selectedOrder ? (
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                {/* Order Top Bar Header */}
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h3 className="font-heading fw-extrabold text-dark mb-0">Order #{selectedOrder.orderNumber}</h3>
                      <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold">
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <span className="text-muted small">Placed on {selectedOrder.createdAt}</span>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1"
                    >
                      <Printer size={15} />
                      <span>Tax Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(selectedOrder)}
                      className="btn btn-sm btn-success rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-1"
                      style={{ background: '#0A6836' }}
                    >
                      <RotateCcw size={15} />
                      <span>Reorder All Items</span>
                    </button>
                  </div>
                </div>

                {/* Live Delivery Progress Tracker Timeline */}
                <div className="rounded-4 p-4 mb-4 border shadow-2xs" style={{ background: '#F8FAFC' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="font-heading fw-extrabold text-dark mb-0 d-flex align-items-center gap-2 fs-6">
                      <Truck size={20} className="text-success" />
                      <span>Flipkart / Zepto Style Order Tracking</span>
                    </h6>
                    <span className="badge bg-success text-white rounded-pill px-2.5 py-1 small fw-bold">
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Horizontal Timeline Stepper */}
                  <div className="position-relative my-4 px-2">
                    <div
                      className="position-absolute top-50 start-0 translate-middle-y w-100 bg-secondary bg-opacity-25"
                      style={{ height: '4px', zIndex: 1 }}
                    />
                    <div
                      className="position-absolute top-50 start-0 translate-middle-y bg-success transition-all"
                      style={{
                        height: '4px',
                        width: `${(getStatusStepIndex(selectedOrder.status) / 3) * 100}%`,
                        zIndex: 2
                      }}
                    />

                    <div className="d-flex justify-content-between position-relative" style={{ zIndex: 3 }}>
                      {[
                        { label: 'Order Placed', time: '10:24 AM', icon: CheckCircle2 },
                        { label: 'Harvest Packed', time: '10:30 AM', icon: Package },
                        { label: 'Out for Express', time: '10:45 AM', icon: Truck },
                        { label: 'Delivered', time: '11:00 AM', icon: CheckCircle2 }
                      ].map((step, idx) => {
                        const activeIdx = getStatusStepIndex(selectedOrder.status);
                        const isDone = idx <= activeIdx;
                        const isCurrent = idx === activeIdx;
                        const StepIcon = step.icon;

                        return (
                          <div key={idx} className="d-flex flex-column align-items-center text-center">
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center shadow-xs transition-all ${
                                isDone
                                  ? 'bg-success text-white'
                                  : 'bg-white text-muted border'
                              } ${isCurrent ? 'ring-4 ring-success ring-opacity-20 animate-pulse' : ''}`}
                              style={{ width: '40px', height: '40px' }}
                            >
                              <StepIcon size={20} />
                            </div>
                            <span
                              className={`small fw-bold mt-2 d-none d-sm-block ${
                                isDone ? 'text-dark' : 'text-muted'
                              }`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {step.label}
                            </span>
                            <span className="text-muted d-none d-sm-block" style={{ fontSize: '0.68rem' }}>
                              {isDone ? step.time : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Slot info */}
                  <div className="bg-white rounded-3 p-3 border d-flex align-items-center gap-3">
                    <Clock size={20} className="text-success flex-shrink-0" />
                    <div>
                      <span className="text-muted d-block small">Expected Delivery Schedule</span>
                      <strong className="text-dark fw-bold">{selectedOrder.deliveryTimeText}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Executive Card (Active Orders) */}
                {selectedOrder.status !== 'Delivered' && (
                  <div
                    className="rounded-4 p-3 p-md-4 mb-4 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 shadow-xs"
                    style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center text-success font-heading fw-extrabold shadow-sm border"
                        style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}
                      >
                        🚴
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong className="text-dark font-heading fw-extrabold fs-6">Ramesh Sharma</strong>
                          <span className="badge bg-success text-white rounded-pill px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                            Assigned Express Partner
                          </span>
                        </div>
                        <span className="small text-muted d-block">
                          EV Scooter KA-05-EV-4021 · Verified Cold Transport Executive
                        </span>
                        <span className="small text-success fw-bold">Delivery OTP: 4821</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <a
                        href="tel:918707375679"
                        className="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold text-white d-flex align-items-center gap-1"
                        style={{ background: '#0A6836' }}
                      >
                        <Phone size={14} />
                        <span>Call Partner</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Produce Items List */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="font-heading fw-extrabold text-dark mb-0 fs-6">
                    Produce Harvest Items ({selectedOrder.items.length})
                  </h6>
                  <span className="small text-muted">Prices inclusive of organic farm taxes</span>
                </div>

                <div className="table-responsive mb-4 border rounded-4 overflow-hidden">
                  <table className="table align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 px-3">Item Details</th>
                        <th className="py-3">Weight/Pack</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Qty</th>
                        <th className="py-3 text-end px-3">Subtotal</th>
                        <th className="py-3 text-center px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 px-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="position-relative bg-light rounded-3 p-1 flex-shrink-0 border"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <Image
                                  src={item.image || '/images/carrots.png'}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  className="object-fit-contain p-1"
                                />
                              </div>
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>
                                  {item.name}
                                </span>
                                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-0.5" style={{ fontSize: '0.62rem' }}>
                                  🌿 100% Pesticide-Free
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted small py-3">{item.weight}</td>
                          <td className="fw-bold text-dark py-3">₹{item.price}</td>
                          <td className="fw-bold text-dark py-3">x{item.quantity}</td>
                          <td className="text-end fw-extrabold text-success py-3 px-3">
                            ₹{item.price * item.quantity}
                          </td>
                          <td className="text-center py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setReviewModalItem({ id: item.id, name: item.name })}
                              className="btn btn-sm btn-outline-warning rounded-pill px-2.5 py-1 text-dark fw-bold d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '0.72rem' }}
                            >
                              <Star size={12} className="text-warning fill-warning" />
                              <span>Rate ⭐</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Delivery Address & Payment Summary Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3.5 bg-light rounded-4 border h-100">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={16} className="text-success" />
                          <h6 className="fw-bold text-dark mb-0 font-heading" style={{ fontSize: '0.9rem' }}>
                            Delivery Address
                          </h6>
                        </div>
                        <span className="badge bg-white text-muted border rounded-pill px-2 py-0.5 small">
                          Home
                        </span>
                      </div>
                      <strong className="d-block text-dark small mb-1">
                        {selectedOrder.address.fullName} ({selectedOrder.address.mobile})
                      </strong>
                      <p className="text-muted small mb-0 leading-tight">
                        {selectedOrder.address.address}, {selectedOrder.address.landmark}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3.5 bg-light rounded-4 border h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <Receipt size={16} className="text-success" />
                            <h6 className="fw-bold text-dark mb-0 font-heading" style={{ fontSize: '0.9rem' }}>
                              Payment & Tax Invoice
                            </h6>
                          </div>
                          <span className="badge bg-success text-white rounded-pill px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between text-muted small mb-1">
                          <span>Payment Method:</span>
                          <strong className="text-dark">{selectedOrder.paymentMethod}</strong>
                        </div>
                        {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                          <div className="d-flex justify-content-between text-success small mb-1">
                            <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                            <strong>-₹{selectedOrder.discountAmount}</strong>
                          </div>
                        )}
                        <div className="d-flex justify-content-between text-muted small mb-1">
                          <span>Express Cold Delivery:</span>
                          <strong className="text-success">FREE</strong>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                        <span className="fw-bold text-dark">Total Amount Paid:</span>
                        <span className="font-heading fs-5 fw-extrabold text-success">
                          ₹{selectedOrder.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Support & WhatsApp Help Button */}
                <div className="p-3 bg-white border rounded-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 shadow-2xs">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2.5 rounded-circle bg-success-subtle text-success">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <strong className="text-dark d-block small font-heading fw-bold">Need Help with Order #{selectedOrder.orderNumber}?</strong>
                      <span className="text-muted small">Instant 24/7 WhatsApp assistance for returns or delivery updates</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => sendWhatsAppHelp(selectedOrder.orderNumber)}
                    className="btn rounded-pill px-4 py-2.5 fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-xs"
                    style={{ background: '#25D366', border: 'none' }}
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Support</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                <ShoppingBag size={48} className="text-muted mb-3" />
                <h5>No Order Selected</h5>
                <p className="text-muted">Select an order from the left column to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Review Rating Modal */}
      {reviewModalItem && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1080 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-heading fw-bold text-dark d-flex align-items-center gap-2">
                  <Star size={20} className="text-warning fill-warning" />
                  <span>Rate & Review Produce</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="btn-close"
                ></button>
              </div>

              {reviewSubmitted ? (
                <div className="modal-body text-center py-5">
                  <CheckCircle2 size={48} className="text-success mb-3 animate-bounce" />
                  <h5 className="fw-bold text-dark">Thank You for Your Feedback!</h5>
                  <p className="text-muted small">Your organic product review has been published successfully.</p>
                </div>
              ) : (
                <form onSubmit={submitReview}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">
                      How was the freshness and quality of <strong>{reviewModalItem.name}</strong>?
                    </p>

                    <div className="d-flex justify-content-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="btn btn-link p-0 border-0 text-decoration-none"
                        >
                          <Star
                            size={32}
                            className={star <= rating ? 'text-warning fill-warning' : 'text-muted'}
                          />
                        </button>
                      ))}
                    </div>

                    <label className="form-label fw-bold small text-dark">Write your feedback (Optional)</label>
                    <textarea
                      rows={3}
                      className="form-control rounded-3 small shadow-none"
                      placeholder="Tell us about freshness, crispness, packaging..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>

                  <div className="modal-footer border-top bg-light rounded-bottom-4">
                    <button
                      type="button"
                      onClick={() => setReviewModalItem(null)}
                      className="btn btn-light border rounded-pill px-4 fw-bold small"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success rounded-pill px-4 fw-bold small"
                      style={{ background: '#0A6836' }}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
