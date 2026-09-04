'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Sun,
  Sunrise,
  Sunset,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Wallet,
  Building2,
  PackageCheck,
  MessageSquare,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    couponCode,
    couponDiscountAmount,
    applyCoupon,
    deliveryFee,
    totalAmount,
    clearCart,
    deliverySlot,
    deliveryDate,
    slotTimeText,
    setDeliverySlotPreference
  } = useCart();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

  // Form State Step 1: Address
  const [addressForm, setAddressForm] = useState({
    fullName: 'Sanjay Kumar',
    mobile: '8707375679',
    email: 'sanjay@freshvana.com',
    address: 'Flat 402, Green Meadows, Organic Park Road',
    landmark: 'Near Lotus Lake',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  });

  // Form State Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('sanjay@okaxis');

  // Order Result State Step 4
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [whatsappMsg, setWhatsappMsg] = useState<string>('');

  const sendOrderToWhatsApp = (msgText?: string) => {
    const textToSend = msgText || whatsappMsg;
    if (!textToSend) return;
    const encoded = encodeURIComponent(textToSend);
    const targetNumber = '918707375679';
    window.open(`https://api.whatsapp.com/send?phone=${targetNumber}&text=${encoded}`, '_blank');
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Place Order Step
      const newOrderId = `FV-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(newOrderId);

      // Construct WhatsApp Order details message
      const itemsList = cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product.name}* (${item.selectedWeight}) x ${item.quantity} = ₹${item.itemPrice * item.quantity}`
        )
        .join('\n');

      const messageText = `🌿 *FRESHVANA NEW ORDER DETAILS* 🌿
-----------------------------------
*Order Reference ID:* ${newOrderId}
*Customer Name:* ${addressForm.fullName}
*Customer Mobile:* ${addressForm.mobile}
*Delivery Address:* ${addressForm.address}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}
*Delivery Slot:* ${deliveryDate} (${deliverySlot} - ${slotTimeText})
*Payment Method:* ${paymentMethod.toUpperCase()}

📦 *ORDERED PRODUCE:*
${itemsList}

-----------------------------------
*Subtotal:* ₹${subtotal}
*Discount:* ${couponDiscountAmount > 0 ? `-₹${couponDiscountAmount}` : '₹0'}
*Delivery Charge:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
-----------------------------------
💰 *FINAL TOTAL PRICE:* ₹${totalAmount}
-----------------------------------
Thank you for your organic order! 🍎🥦`;

      setWhatsappMsg(messageText);
      setOrderConfirmed(true);
      setCurrentStep(4);

      // Save order to localStorage for /orders tracking page
      const newOrderObj = {
        id: `ord-${Date.now()}`,
        orderNumber: newOrderId,
        createdAt: 'Just Now',
        status: 'Order Confirmed',
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          weight: item.selectedWeight,
          price: item.itemPrice,
          quantity: item.quantity,
          image: item.product.image || '/images/carrots.png'
        })),
        itemCount: cart.reduce((acc, i) => acc + i.quantity, 0),
        totalAmount: totalAmount,
        discountAmount: couponDiscountAmount,
        couponCode: couponCode || undefined,
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod.toUpperCase(),
        paymentStatus: paymentMethod === 'cod' ? 'COD' : 'Paid',
        address: {
          fullName: addressForm.fullName,
          mobile: addressForm.mobile,
          email: addressForm.email,
          address: addressForm.address,
          landmark: addressForm.landmark,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode
        },
        deliverySlot: {
          date: deliveryDate,
          timeSlot: deliverySlot,
          slotTimeText: slotTimeText,
          isExpress: deliverySlot === 'Express'
        },
        deliveryTimeText: `${deliveryDate} · ${slotTimeText}`
      };

      try {
        const existingSaved = localStorage.getItem('freshvana_customer_orders');
        const existingOrders = existingSaved ? JSON.parse(existingSaved) : [];
        localStorage.setItem(
          'freshvana_customer_orders',
          JSON.stringify([newOrderObj, ...(Array.isArray(existingOrders) ? existingOrders : [])])
        );
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }

      // Automatically launch WhatsApp link for 8707375679
      sendOrderToWhatsApp(messageText);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error('Confetti error', e);
      }

      clearCart();
    }
  };

  return (
    <div className="bg-cream min-vh-100 pb-5" style={{ paddingTop: '150px' }}>
      <div className="container py-4">
        {/* Stepper Navigation Bar */}
        {!orderConfirmed && (
          <div className="max-w-3xl mx-auto mb-5">
            <div className="d-flex align-items-center justify-content-between position-relative px-2">
              <div
                className="position-absolute top-50 start-0 w-100 translate-middle-y bg-secondary bg-opacity-25"
                style={{ height: '3px', zIndex: 1 }}
              />
              <div
                className="position-absolute top-50 start-0 translate-middle-y bg-success transition-all"
                style={{
                  height: '3px',
                  zIndex: 1,
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                }}
              />

              {/* Step 1 */}
              <div
                className={`position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                  currentStep >= 1 ? 'bg-success text-white' : 'bg-light text-muted'
                }`}
                style={{ width: '44px', height: '44px', zIndex: 2 }}
              >
                1
              </div>
              {/* Step 2 */}
              <div
                className={`position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                  currentStep >= 2 ? 'bg-success text-white' : 'bg-light text-muted'
                }`}
                style={{ width: '44px', height: '44px', zIndex: 2 }}
              >
                2
              </div>
              {/* Step 3 */}
              <div
                className={`position-relative rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                  currentStep >= 3 ? 'bg-success text-white' : 'bg-light text-muted'
                }`}
                style={{ width: '44px', height: '44px', zIndex: 2 }}
              >
                3
              </div>
            </div>

            <div className="d-flex justify-content-between small font-heading fw-bold mt-2 text-dark">
              <span>1. Address</span>
              <span>2. Delivery Preference</span>
              <span>3. Payment</span>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED SCREEN */}
        {orderConfirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-4 p-4 p-md-5 border shadow-lg text-center"
          >
            <div className="fs-1 mb-3">🎉</div>
            <span
              className="badge rounded-pill fw-extrabold px-3 py-2 mb-2 d-inline-block"
              style={{ backgroundColor: '#E8F5E9', color: '#0A6836', border: '1px solid #81C784' }}
            >
              ORDER PLACED SUCCESSFULLY
            </span>
            <h1 className="font-heading display-6 fw-extrabold text-dark mb-2">
              Thank You! Order Confirmed
            </h1>
            <p className="text-muted mb-4">
              Your farm-fresh organic produce is currently being packed in protective eco-crates.
            </p>

            <div className="p-4 bg-light rounded-4 border mb-4 text-start">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <span className="small text-muted d-block">ORDER REFERENCE ID</span>
                  <span className="font-heading fw-bold text-success fs-5">{orderId}</span>
                </div>
                <span className="badge bg-success text-white px-3 py-2">Paid & Verified</span>
              </div>

              <div className="row g-3 small">
                <div className="col-sm-6">
                  <strong className="text-dark d-block">Delivery Date & Slot:</strong>
                  <span className="text-muted">{deliveryDate} ({deliverySlot} - {slotTimeText})</span>
                </div>
                <div className="col-sm-6">
                  <strong className="text-dark d-block">Delivery Address:</strong>
                  <span className="text-muted">{addressForm.fullName}, {addressForm.address}, {addressForm.city}</span>
                </div>
              </div>
            </div>

            {/* Tracking Status Timeline */}
            <div className="p-4 bg-white border rounded-4 mb-4 text-start">
              <h6 className="font-heading fw-bold text-dark mb-3">Live Order Tracking</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <div>
                    <strong className="text-dark d-block">Harvest Received & Checked</strong>
                    <span className="small text-muted">Quality inspect complete</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <PackageCheck size={20} className="text-success" />
                  <div>
                    <strong className="text-dark d-block">Packing in Cold Crate</strong>
                    <span className="small text-muted">Temperature holding at 4°C</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 opacity-50">
                  <Truck size={20} className="text-muted" />
                  <div>
                    <strong className="text-dark d-block">Out for 2-Hour Express Delivery</strong>
                    <span className="small text-muted">Assigning delivery partner</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                href="/orders"
                className="btn btn-success rounded-pill px-4 py-3 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
                style={{ background: '#0A6836', border: 'none' }}
              >
                <PackageCheck size={20} />
                <span>Track & View Order Details</span>
              </Link>

              <button
                type="button"
                onClick={() => sendOrderToWhatsApp()}
                className="btn rounded-pill px-4 py-3 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
                style={{ background: '#25D366', border: 'none' }}
              >
                <MessageSquare size={20} />
                <span>Send on WhatsApp (8707375679)</span>
              </button>

              <Link href="/shop" className="btn btn-outline-success rounded-pill px-4 py-3 fw-bold">
                Continue Fresh Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          /* STEP 1 - 3 CHECKOUT STEPS */
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 border shadow-sm p-4 p-md-5">
                <AnimatePresence mode="wait">
                  {/* STEP 1: ADDRESS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="font-heading fw-bold text-dark mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <MapPin size={22} className="text-success" />
                        <span>Step 1 — Delivery Address</span>
                      </h4>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">Full Name</label>
                          <input
                            type="text"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">Mobile Number</label>
                          <input
                            type="tel"
                            value={addressForm.mobile}
                            onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-dark">Email Address</label>
                          <input
                            type="email"
                            value={addressForm.email}
                            onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold small text-dark">Flat / House / Street Address</label>
                          <input
                            type="text"
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">Landmark</label>
                          <input
                            type="text"
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">City</label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">State</label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-dark">Pincode</label>
                          <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DELIVERY PREFERENCE */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="font-heading fw-bold text-dark mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <Calendar size={22} className="text-success" />
                        <span>Step 2 — Select Delivery Preference</span>
                      </h4>

                      <label className="form-label fw-bold small text-dark mb-3">SELECT DELIVERY TIME SLOT</label>
                      <div className="row g-3 mb-4">
                        {[
                          { id: 'Morning', title: '🌅 Morning', time: '7 AM – 10 AM', icon: Sunrise, color: '#D97706' },
                          { id: 'Afternoon', title: '☀️ Afternoon', time: '12 PM – 3 PM', icon: Sun, color: '#EA580C' },
                          { id: 'Evening', title: '🌙 Evening', time: '5 PM – 8 PM', icon: Sunset, color: '#4F46E5' },
                          { id: 'Express', title: '⚡ Express', time: '2-Hour Delivery', icon: Zap, color: '#059669' }
                        ].map((slot) => {
                          const Icon = slot.icon;
                          const isSelected = deliverySlot === slot.id;
                          return (
                            <div className="col-md-3 col-6" key={slot.id}>
                              <div
                                onClick={() => setDeliverySlotPreference(slot.id as any)}
                                className="p-3 rounded-4 border text-center transition-all shadow-xs"
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? '#E8F5E9' : '#FFFFFF',
                                  borderColor: isSelected ? '#0A6836' : '#CBD5E1',
                                  borderWidth: isSelected ? '2px' : '1px'
                                }}
                              >
                                <Icon size={28} className="mb-2" style={{ color: slot.color }} />
                                <h6 className="fw-extrabold text-dark mb-1" style={{ fontSize: '0.9rem' }}>
                                  {slot.title}
                                </h6>
                                <span className="small text-secondary fw-semibold d-block" style={{ fontSize: '0.75rem' }}>
                                  {slot.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-light rounded-4 border">
                        <label className="form-label fw-bold small text-dark mb-2">DELIVERY DATE</label>
                        <div className="row g-2">
                          {['Today', 'Tomorrow', 'Day After'].map((d) => {
                            const isSel = deliveryDate === d;
                            return (
                              <div className="col-4" key={d}>
                                <button
                                  type="button"
                                  onClick={() => setDeliverySlotPreference(deliverySlot, d)}
                                  className="btn w-100 py-2.5 px-1 rounded-3 fw-bold border transition-all text-truncate"
                                  style={{
                                    fontSize: '0.8rem',
                                    backgroundColor: isSel ? '#0A6836' : '#FFFFFF',
                                    color: isSel ? '#FFFFFF' : '#1E293B',
                                    borderColor: isSel ? '#0A6836' : '#CBD5E1'
                                  }}
                                >
                                  {d}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PAYMENT METHOD */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="font-heading fw-bold text-dark mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <CreditCard size={22} className="text-success" />
                        <span>Step 3 — Select Payment Method</span>
                      </h4>

                      <div className="d-flex flex-column gap-3 mb-4">
                        {/* UPI */}
                        <div
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-3 rounded-4 border d-flex align-items-center justify-content-between ${
                            paymentMethod === 'upi' ? 'border-success bg-success bg-opacity-10' : 'bg-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <QrCode className="text-success" size={24} />
                            <div>
                              <strong className="text-dark d-block">UPI (GPay / PhonePe / Paytm)</strong>
                              <span className="small text-muted">Instant 0-Fee Bank Transfer</span>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                        </div>

                        {paymentMethod === 'upi' && (
                          <div className="p-3 bg-white border rounded-3 ms-4">
                            <label className="form-label small fw-bold text-dark">ENTER UPI ID / VPA</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="form-control"
                              placeholder="username@upi"
                            />
                          </div>
                        )}

                        {/* Card */}
                        <div
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-4 border d-flex align-items-center justify-content-between ${
                            paymentMethod === 'card' ? 'border-success bg-success bg-opacity-10' : 'bg-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <CreditCard className="text-primary" size={24} />
                            <div>
                              <strong className="text-dark d-block">Credit / Debit Card</strong>
                              <span className="small text-muted">Visa, MasterCard, RuPay</span>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'card'} readOnly />
                        </div>

                        {/* NetBanking */}
                        <div
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`p-3 rounded-4 border d-flex align-items-center justify-content-between ${
                            paymentMethod === 'netbanking' ? 'border-success bg-success bg-opacity-10' : 'bg-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <Building2 className="text-warning" size={24} />
                            <div>
                              <strong className="text-dark d-block">Net Banking</strong>
                              <span className="small text-muted">All Major Indian Banks</span>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'netbanking'} readOnly />
                        </div>

                        {/* COD */}
                        <div
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-3 rounded-4 border d-flex align-items-center justify-content-between ${
                            paymentMethod === 'cod' ? 'border-success bg-success bg-opacity-10' : 'bg-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <Wallet className="text-secondary" size={24} />
                            <div>
                              <strong className="text-dark d-block">Cash on Delivery (COD)</strong>
                              <span className="small text-muted">Pay at doorstep upon delivery</span>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step Action Buttons */}
                <div className="row g-2 pt-4 border-top">
                  {currentStep > 1 && (
                    <div className="col-5 col-sm-4">
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn btn-outline-secondary rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-1"
                      >
                        <ArrowLeft size={16} />
                        <span>Previous</span>
                      </button>
                    </div>
                  )}
                  <div className={currentStep > 1 ? "col-7 col-sm-8" : "col-12"}>
                    <button
                      onClick={handleNextStep}
                      className="btn btn-success rounded-pill w-100 py-3 fw-extrabold d-flex align-items-center justify-content-center gap-2 shadow-md"
                      style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E66000 100%)', border: 'none' }}
                    >
                      <span>{currentStep === 3 ? `Pay & Confirm (₹${totalAmount})` : 'Continue'}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Side Sidebar */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 border shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                <h5 className="font-heading fw-bold text-dark mb-3 pb-2 border-bottom">
                  Order Summary ({cart.length} items)
                </h5>

                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.selectedWeight}`} className="d-flex justify-content-between small">
                      <span className="text-dark">
                        {item.product.name} ({item.selectedWeight}) x {item.quantity}
                      </span>
                      <span className="fw-bold text-dark">₹{item.itemPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Available Offers Banner */}
                <div
                  onClick={() => setIsCouponDrawerOpen(true)}
                  className="p-3 rounded-3 mb-3 border d-flex align-items-center justify-content-between cursor-pointer transition-all hover-bg-light"
                  style={{ background: 'radial-gradient(circle, #FFF8E1 0%, #FFF3E0 100%)', borderColor: '#FFE0B2' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Zap size={18} className="text-warning flex-shrink-0" />
                    <div>
                      <strong className="d-block text-dark small" style={{ fontSize: '0.82rem' }}>
                        {couponCode ? `Coupon '${couponCode}' Applied!` : 'Apply Coupon & Save Extra'}
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                        {couponCode ? `Saved ₹${couponDiscountAmount}` : 'Click to view active discount vouchers'}
                      </span>
                    </div>
                  </div>
                  <span className="btn btn-xs btn-outline-warning text-dark fw-bold rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                    {couponCode ? 'Change' : 'Offers →'}
                  </span>
                </div>

                <div className="border-top pt-3 d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {couponDiscountAmount > 0 && (
                    <div className="d-flex justify-content-between text-success fw-bold">
                      <span>Coupon Discount ({couponCode})</span>
                      <span>-₹{couponDiscountAmount}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between text-muted">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="d-flex justify-content-between font-heading fs-4 fw-extrabold text-dark pt-2 border-top">
                    <span>Total</span>
                    <span className="text-success">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1-Click Coupon Modal Drawer */}
      <AnimatePresence>
        {isCouponDrawerOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 3000 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCouponDrawerOpen(false)}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="position-relative bg-white rounded-4 p-4 shadow-xl w-100 max-w-md"
              style={{ zIndex: 3001 }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <Zap size={20} className="text-warning" />
                  <h5 className="font-heading fw-bold text-dark mb-0">Apply Coupon Code</h5>
                </div>
                <button
                  onClick={() => setIsCouponDrawerOpen(false)}
                  className="btn btn-sm btn-light rounded-circle p-1"
                >
                  ✕
                </button>
              </div>

              <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {[
                  { code: 'FRESH100', title: '₹100 Flat Discount', desc: 'Flat ₹100 OFF on orders above ₹499', badge: 'POPULAR' },
                  { code: 'ORGANIC20', title: '20% OFF Organic Produce', desc: 'Get 20% discount on all organic items', badge: 'BEST VALUE' },
                  { code: 'WELCOME50', title: '50% OFF New User Deal', desc: '50% OFF up to ₹150 for first-time shoppers', badge: 'WELCOME' },
                  { code: 'FREEDEL', title: 'Free Express Delivery', desc: 'Waive off ₹40 delivery fee on any order', badge: 'FREE SHIPPING' }
                ].map((c) => (
                  <div key={c.code} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <code className="bg-white px-2 py-0.5 rounded border fw-bold text-success" style={{ fontSize: '0.85rem' }}>
                          {c.code}
                        </code>
                        <span className="badge bg-warning-subtle text-dark rounded-pill px-2 py-0.5 small fw-bold">
                          {c.badge}
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.88rem' }}>{c.title}</h6>
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>{c.desc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        applyCoupon(c.code);
                        setIsCouponDrawerOpen(false);
                      }}
                      className="btn btn-sm btn-success rounded-pill px-3 fw-bold flex-shrink-0"
                      style={{ background: '#0A6836' }}
                    >
                      {couponCode === c.code ? 'Applied ✓' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
