'use client';

import React from 'react';
import { Review } from '@/types';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewsCount: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, rating, reviewsCount }) => {
  return (
    <div className="bg-white rounded-4 p-4 p-md-5 border shadow-sm my-4">
      <h3 className="font-heading fw-bold text-dark mb-4 pb-2 border-bottom">
        Customer Reviews & Ratings
      </h3>

      <div className="row gy-4 mb-4">
        {/* Rating Breakdown */}
        <div className="col-md-4 text-center border-end-md">
          <div className="display-4 font-heading fw-extrabold text-success mb-1">
            {rating}
          </div>
          <div className="d-flex justify-content-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                fill={star <= Math.round(rating) ? '#FFB800' : 'none'}
                stroke={star <= Math.round(rating) ? '#FFB800' : '#CBD5E1'}
              />
            ))}
          </div>
          <div className="text-muted small">Based on {reviewsCount} verified customer ratings</div>
        </div>

        {/* Rating Bars */}
        <div className="col-md-8">
          <div className="d-flex flex-column gap-2">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 12 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 0 }
            ].map((b) => (
              <div key={b.stars} className="d-flex align-items-center gap-3">
                <span className="small text-muted fw-bold" style={{ width: '50px' }}>
                  {b.stars} Stars
                </span>
                <div className="progress flex-grow-1" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success rounded-pill"
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
                <span className="small text-muted" style={{ width: '35px' }}>
                  {b.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="d-flex flex-column gap-3 pt-3 border-top">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-3 rounded-3 bg-light border">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '38px', height: '38px' }}
                >
                  {rev.author[0]}
                </div>
                <div>
                  <div className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.92rem' }}>
                    {rev.author}
                    {rev.verified && (
                      <span className="text-success d-inline-flex align-items-center gap-1 small fw-normal ms-1">
                        <CheckCircle size={14} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    {rev.date}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((st) => (
                  <Star
                    key={st}
                    size={14}
                    fill={st <= rev.rating ? '#FFB800' : 'none'}
                    stroke={st <= rev.rating ? '#FFB800' : '#CBD5E1'}
                  />
                ))}
              </div>
            </div>

            <p className="text-dark small mb-2">{rev.comment}</p>

            <button className="btn btn-sm btn-link text-muted p-0 text-decoration-none d-inline-flex align-items-center gap-1 small">
              <ThumbsUp size={14} /> Helpful
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
