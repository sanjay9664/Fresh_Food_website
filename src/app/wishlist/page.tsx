'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="py-5 bg-cream" style={{ paddingTop: '160px', minHeight: '85vh' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 text-danger fw-bold small mb-1">
              <Heart size={18} fill="#E53935" stroke="none" />
              <span>SAVED ITEMS</span>
            </div>
            <h2 className="font-heading display-6 fw-extrabold text-dark mb-0">
              My Organic Wishlist ({wishlist.length})
            </h2>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 mt-3 mt-sm-0"
            >
              <Trash2 size={15} />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm border max-w-md mx-auto my-5">
            <div className="d-flex justify-content-center mb-3">
              <Heart size={48} className="text-danger opacity-50" />
            </div>
            <h4 className="font-heading fw-extrabold text-dark mb-2">Your Wishlist is Empty</h4>
            <p className="text-muted small mb-4">
              Explore our farm harvest and click the heart icon on any produce to save items for later.
            </p>
            <Link
              href="/shop"
              className="btn btn-success rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
              style={{ background: '#0A6836', border: 'none' }}
            >
              <span>Explore Organic Produce</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((item) => {
              const product = item.product;
              return (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="p-3 rounded-4 bg-white border shadow-sm h-100 d-flex flex-column justify-content-between position-relative"
                  >
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 m-3 text-danger shadow-sm border"
                      style={{ width: '32px', height: '32px', zIndex: 5 }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div>
                      <div
                        className="position-relative rounded-3 bg-light p-2 mb-3 overflow-hidden"
                        style={{ height: '180px' }}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-fit-contain p-2"
                        />
                      </div>

                      <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 rounded-pill small mb-2">
                        {product.category}
                      </span>

                      <h6 className="font-heading fw-bold text-dark mb-1">{product.name}</h6>

                      <div className="d-flex align-items-center gap-1 text-warning small mb-3">
                        <Star size={13} fill="#FFB800" stroke="none" />
                        <span className="fw-bold text-dark">{product.rating}</span>
                        <span className="text-muted">({product.reviewsCount})</span>
                      </div>

                      <div className="d-flex align-items-baseline gap-2 mb-3">
                        <span className="fs-5 font-heading fw-extrabold text-success">
                          ₹{product.price}
                        </span>
                        <span className="text-decoration-line-through text-muted small">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        removeFromWishlist(product.id);
                      }}
                      className="btn btn-success rounded-pill w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      style={{ background: '#0A6836', border: 'none' }}
                    >
                      <ShoppingBag size={16} />
                      <span>Move to Cart</span>
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
