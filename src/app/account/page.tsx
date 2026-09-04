'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SavedAddress } from '@/types';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Wallet,
  Gift,
  Share2,
  Copy,
  Home,
  Briefcase,
  Globe,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Aarav Sharma',
    mobile: '98765 43210',
    email: 'aarav@example.com',
    address: 'Flat 402, Green Acres Apartment, HSR Layout Sector 2',
    landmark: 'Near BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    tag: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Aarav Sharma',
    mobile: '98765 43210',
    email: 'aarav@example.com',
    address: 'Building 7, Tech Park, Outer Ring Road, Devarabeesanahalli',
    landmark: 'Opposite Cisco Campus',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    tag: 'Work',
    isDefault: false
  }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'wallet'>('profile');
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const [newAddr, setNewAddr] = useState<Omit<SavedAddress, 'id'>>({
    fullName: 'Aarav Sharma',
    mobile: '98765 43210',
    email: 'aarav@example.com',
    address: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    tag: 'Home',
    isDefault: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('freshvana_saved_addresses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setAddresses(parsed);
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const saveAddressesToStorage = (updated: SavedAddress[]) => {
    setAddresses(updated);
    localStorage.setItem('freshvana_saved_addresses', JSON.stringify(updated));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    let updated = [created, ...addresses];
    if (created.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: a.id === created.id }));
    }
    saveAddressesToStorage(updated);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: 'Aarav Sharma',
      mobile: '98765 43210',
      email: 'aarav@example.com',
      address: '',
      landmark: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
      tag: 'Home',
      isDefault: false
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    saveAddressesToStorage(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddressesToStorage(updated);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('FRESH-AARAV100');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <div className="min-vh-100 bg-cream py-4 py-md-5">
      <div className="container">
        {/* Navigation & Header */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link href="/" className="btn btn-sm btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-heading fs-3 fw-bold text-dark mb-0">My Account Dashboard</h1>
            <span className="text-muted small">Manage profile, saved addresses & loyalty cash</span>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Navigation Sidebar */}
          <div className="col-lg-4 col-xl-3">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white mb-4">
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '50px', height: '50px' }}>
                  A
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">Aarav Sharma</h6>
                  <span className="text-muted small">aarav@example.com</span>
                  <div className="mt-1">
                    <span className="badge bg-success-subtle text-success rounded-pill px-2 py-0.5" style={{ fontSize: '0.68rem' }}>
                      VIP Organic Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                {[
                  { id: 'profile', label: 'Personal Profile', icon: User },
                  { id: 'addresses', label: 'Saved Address Book', icon: MapPin, badge: addresses.length },
                  { id: 'wallet', label: 'FreshVana Cash & Rewards', icon: Wallet, badge: '₹150' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`btn text-start d-flex align-items-center justify-content-between p-3 rounded-3 fw-semibold transition-all border-0 ${
                        isActive
                          ? 'btn-success text-white shadow-sm'
                          : 'btn-light text-dark hover-bg-light'
                      }`}
                      style={{ background: isActive ? 'linear-gradient(135deg, #0A6836, #064E28)' : undefined }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <Icon size={18} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`badge rounded-pill px-2 py-1 ${isActive ? 'bg-white text-success' : 'bg-secondary-subtle text-dark'}`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <Link href="/orders" className="btn text-start d-flex align-items-center gap-3 p-3 rounded-3 fw-semibold btn-light text-dark border-0 mt-1">
                  <ShieldCheck size={18} className="text-success" />
                  <span>My Orders & Tracking</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="col-lg-8 col-xl-9">
            {/* TAB 1: PERSONAL PROFILE */}
            {activeTab === 'profile' && (
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <h5 className="font-heading fw-bold text-dark mb-4">Personal Details</h5>

                <form onSubmit={(e) => { e.preventDefault(); alert('Profile updated!'); }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">First Name</label>
                      <input type="text" className="form-control rounded-3 py-2" defaultValue="Aarav" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Last Name</label>
                      <input type="text" className="form-control rounded-3 py-2" defaultValue="Sharma" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Email Address</label>
                      <input type="email" className="form-control rounded-3 py-2" defaultValue="aarav@example.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted">Mobile Number</label>
                      <input type="tel" className="form-control rounded-3 py-2" defaultValue="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                    <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" style={{ background: '#0A6836' }}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: SAVED ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h5 className="font-heading fw-bold text-dark mb-0">Saved Address Book</h5>
                    <span className="text-muted small">Manage delivery locations for 1-tap checkout</span>
                  </div>

                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                    style={{ background: '#0A6836' }}
                  >
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Add Address Form Accordion */}
                <AnimatePresence>
                  {isAddingAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-cream rounded-4 p-4 mb-4 border"
                    >
                      <h6 className="fw-bold text-dark mb-3">Add New Delivery Location</h6>
                      <form onSubmit={handleAddAddress}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Full Name</label>
                            <input
                              type="text"
                              required
                              className="form-control rounded-3"
                              value={newAddr.fullName}
                              onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Mobile Phone</label>
                            <input
                              type="tel"
                              required
                              className="form-control rounded-3"
                              value={newAddr.mobile}
                              onChange={(e) => setNewAddr({ ...newAddr, mobile: e.target.value })}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-bold">Street Address / House No. / Apartment</label>
                            <input
                              type="text"
                              required
                              className="form-control rounded-3"
                              placeholder="e.g. Flat 402, Green Acres Apartment"
                              value={newAddr.address}
                              onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Landmark</label>
                            <input
                              type="text"
                              className="form-control rounded-3"
                              placeholder="e.g. Near BDA Complex"
                              value={newAddr.landmark}
                              onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Pincode</label>
                            <input
                              type="text"
                              required
                              className="form-control rounded-3"
                              value={newAddr.pincode}
                              onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Tag As</label>
                            <select
                              className="form-select rounded-3"
                              value={newAddr.tag}
                              onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value as any })}
                            >
                              <option value="Home">🏡 Home</option>
                              <option value="Work">🏢 Work</option>
                              <option value="Other">📍 Other</option>
                            </select>
                          </div>
                          <div className="col-md-6 d-flex align-items-end">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="defCheck"
                                checked={newAddr.isDefault}
                                onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                              />
                              <label className="form-check-label small fw-bold" htmlFor="defCheck">
                                Set as Default Delivery Address
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setIsAddingAddress(false)}
                            className="btn btn-light border rounded-pill px-3 fw-bold"
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold" style={{ background: '#0A6836' }}>
                            Save Address
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address Cards List */}
                <div className="row g-3">
                  {addresses.map((addr) => (
                    <div className="col-md-6" key={addr.id}>
                      <div className={`p-3 rounded-4 border h-100 position-relative bg-white transition-all ${
                        addr.isDefault ? 'border-2 border-success shadow-sm' : ''
                      }`}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1 fw-bold">
                            {addr.tag === 'Home' ? '🏡 Home' : addr.tag === 'Work' ? '🏢 Work' : '📍 Other'}
                          </span>

                          {addr.isDefault && (
                            <span className="badge bg-success text-white rounded-pill px-2 py-0.5 small fw-bold">
                              Default
                            </span>
                          )}
                        </div>

                        <h6 className="fw-bold text-dark mb-1">{addr.fullName}</h6>
                        <span className="text-muted small d-block mb-2">{addr.mobile}</span>
                        <p className="text-muted small mb-3 leading-tight" style={{ fontSize: '0.82rem' }}>
                          {addr.address}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                        </p>

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="btn btn-link p-0 text-success text-decoration-none small fw-bold"
                            >
                              Make Default
                            </button>
                          ) : (
                            <span className="text-success small fw-bold">Primary Location</span>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="btn btn-sm text-danger p-1 hover-bg-light rounded-2"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: WALLET & REWARDS */}
            {activeTab === 'wallet' && (
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <h5 className="font-heading fw-bold text-dark mb-4">FreshVana Cash & Rewards</h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-4 rounded-4 text-white shadow-sm position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A6836 0%, #064E28 100%)' }}>
                      <span className="text-white-50 small fw-bold text-uppercase d-block mb-1">Available Cash Balance</span>
                      <h2 className="font-heading display-6 fw-extrabold text-white mb-0">₹150.00</h2>
                      <small className="text-white-50">100% usable on your next fresh grocery order</small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-4 rounded-4 bg-light border h-100 d-flex flex-column justify-content-between">
                      <div>
                        <span className="text-muted small fw-bold d-block mb-1">Referral Rewards</span>
                        <h6 className="fw-bold text-dark mb-1">Invite Friends & Get ₹100 Cash</h6>
                        <p className="text-muted small mb-0">Share your referral link with friends. They get ₹100 OFF, and you get ₹100 in your wallet!</p>
                      </div>

                      <div className="d-flex align-items-center gap-2 mt-3">
                        <code className="bg-white px-3 py-1.5 rounded-3 border fw-bold text-success fs-6 flex-grow-1 text-center">
                          FRESH-AARAV100
                        </code>
                        <button onClick={copyReferralCode} className="btn btn-success btn-sm rounded-3 px-3 fw-bold" style={{ background: '#0A6836' }}>
                          {copiedReferral ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
